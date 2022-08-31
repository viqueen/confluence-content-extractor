import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

export interface Identifier {
    id: string;
    title: string;
}

export interface Attachment {
    fileId: string;
    downloadUrl: string;
    mediaType: string;
    isCover: boolean;
}

export interface AttachmentData {
    stream: any;
}

export interface Content {
    identifier: Identifier;
    type: 'page' | 'blogpost';
    excerpt: string;
    author: Identifier & { avatar: string; accountId: string };
    createdDate: number;
    lastModifiedDate: number;
    adfBody: any;
    asHomepage: boolean;

    children?: Array<Identifier>;
    ancestors?: Array<Identifier>;
    attachments?: Array<Attachment>;
    cover?: Attachment;
}

export interface ResourceObject {
    resourceUrl: string;
}

export interface ResourceDefinition {
    url: string;
    generator: { icon: { url: string } };
    name: string;
    '@type': string;
}

const identifier = (item: any): Identifier => ({
    id: item.id,
    title: item.title
});

class Api {
    private readonly client: AxiosInstance;
    constructor() {
        this.client = axios.create({
            baseURL: `https://${config.CONFLUENCE_SITE}`,
            auth: {
                username: config.CONFLUENCE_USERNAME,
                password: config.CONFLUENCE_API_TOKEN
            }
        });
    }

    getSpaceHomepage(spaceKey: string): Promise<Identifier> {
        return this.client
            .get(`/wiki/rest/api/space/${spaceKey}?expand=homepage`)
            .then(({ data }) => ({
                id: data.homepage.id,
                title: data.homepage.title
            }));
    }

    getSpaceBlogs(spaceKey: string): Promise<Array<Content>> {
        const query = new URLSearchParams({
            cql: `space=${spaceKey} and type=blogpost order by created desc`,
            expand: 'content.history'
        });
        return this.client
            .get(`/wiki/rest/api/search?${query.toString()}`)
            .then((response) => response.data.results)
            .then((results) => {
                return results.map((item: any) => {
                    const { content, excerpt } = item;
                    const { history, id, title, type } = content;
                    return {
                        identifier: { id, title },
                        type,
                        excerpt: excerpt,
                        author: {
                            id: history.createdBy.publicName,
                            title: history.createdBy.displayName
                        },
                        createdDate: new Date(history.createdDate).getTime()
                    };
                });
            });
    }

    async getContentById(
        contentId: Pick<Identifier, 'id'>,
        asHomepage = false
    ): Promise<Content> {
        return this.getContent(`id=${contentId.id}`, asHomepage);
    }

    async getContent(cql: string, asHomepage = false): Promise<Content> {
        const contentExpansions = [
            'content.body.atlas_doc_format',
            'content.children.page',
            'content.children.attachment.metadata.labels',
            'content.ancestors',
            'content.history'
        ];
        const query = new URLSearchParams({
            cql: cql,
            expand: contentExpansions.join(',')
        });
        const { data } = await this.client.get(
            `/wiki/rest/api/search?${query.toString()}`
        );

        const item = data.results[0];
        const { content, excerpt, lastModified } = item;
        const { children, ancestors, id, title, history, body, type } = content;
        const childPages = children.page?.results || [];
        const parentPages = ancestors || [];
        const files = children.attachment?.results || [];

        const attachments = files.map(
            ({ extensions, _links, metadata }: any) => ({
                fileId: extensions.fileId,
                downloadUrl: _links.download,
                mediaType: extensions.mediaType,
                isCover: metadata.labels.results.some(
                    (i: any) => i.name === 'cover'
                )
            })
        );

        const cover = attachments.find((a: Attachment) => a.isCover);

        return {
            identifier: { id, title },
            author: {
                id: history.createdBy.publicName,
                accountId: history.createdBy.accountId,
                title: history.createdBy.displayName,
                avatar: history.createdBy.profilePicture.path
            },
            adfBody: JSON.parse(body.atlas_doc_format.value),
            asHomepage,
            type,
            excerpt,
            createdDate: new Date(history.createdDate).getTime(),
            lastModifiedDate: new Date(lastModified).getTime(),
            children: childPages.map(identifier),
            ancestors: parentPages.map(identifier),
            attachments,
            cover
        };
    }

    getObjects(
        resourceUrls: Array<ResourceObject>
    ): Promise<Array<{ body: { data: ResourceDefinition } }>> {
        return this.client
            .post('/gateway/api/object-resolver/resolve/batch', resourceUrls, {
                headers: {
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    cookie: `cloud.session.token=${config.CONFLUENCE_CLOUD_TOKEN}`
                }
            })
            .then((response) => {
                return response.data;
            });
    }

    getAttachmentData(
        targetUrl: string,
        prefix: string = '/wiki'
    ): Promise<AttachmentData> {
        return this.client
            .get(`${prefix}${targetUrl}`, {
                responseType: 'stream'
            })
            .then((response) => ({ stream: response.data }));
    }
}

const api = new Api();
export default api;
