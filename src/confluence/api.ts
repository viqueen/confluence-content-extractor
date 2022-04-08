import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

export interface Identifier {
    id: string;
    title: string;
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
}

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
}

const api = new Api();
export default api;
