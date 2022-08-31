import { Output } from '../output';
import { Content } from '../confluence/api';
import { traverse } from '@atlaskit/adf-utils/traverse';
import { ADFEntity } from '@atlaskit/adf-utils/types';
import fs from 'fs';
import path from 'path';
import axios, { AxiosInstance } from 'axios';

const fetchEmoji = async (
    client: AxiosInstance,
    id: string,
    output: Output
) => {
    const targetFile = path.resolve(output.assets.emojis, `${id}.png`);
    if (fs.existsSync(targetFile)) return;

    const targetUrl = id.startsWith('atlassian')
        ? `/atlassian/${id.split('-')[1]}_64.png`
        : `/standard/caa27a19-fc09-4452-b2b4-a301552fd69c/64x64/${id}.png`;

    return client
        .get(`${targetUrl}`, { responseType: 'stream' })
        .then((response) => ({ stream: response.data }))
        .then(({ stream }) => {
            const file = fs.createWriteStream(targetFile);
            return stream.pipe(file);
        });
};

export const extractEmojis = async (content: Content, output: Output) => {
    const client = axios.create({
        baseURL:
            'https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net'
    });

    traverse(content.adfBody, {
        emoji: (node: ADFEntity) => {
            if (!node.attrs) return;
            fetchEmoji(client, node.attrs.id, output);
        }
    });
};
