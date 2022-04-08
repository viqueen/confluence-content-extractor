import path from 'path';
import * as fs from "fs";

export interface Output {
    pages: string;
    blogs: string;
    attachments: string;
}

const setup = (destination: string): Output => {
    const siteOutput = path.resolve(destination, 'site');
    const output: Output = {
        pages: path.resolve(siteOutput, 'pages'),
        blogs: path.resolve(siteOutput, 'blogs'),
        attachments: path.resolve(siteOutput, 'attachments')
    };

    Object.values(output)
        .forEach((directory) => fs.mkdirSync(directory, { recursive: true }));

    return output;
}

export { setup };
