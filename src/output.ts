import path from 'path';
import * as fs from 'fs';

export interface Output {
    pages: string;
    blogs: string;
    attachments: string;
    home: string;
    objectResolver: string;
    assets: { avatars: string };
}

const makeOutputDirectories = (data: any) => {
    for (const dir of Object.values(data)) {
        if (typeof dir === 'string') fs.mkdirSync(dir, { recursive: true });
        else makeOutputDirectories(dir);
    }
};

const setup = (destination: string): Output => {
    const siteOutput = path.resolve(destination, 'site');
    const output: Output = {
        home: siteOutput,
        pages: path.resolve(siteOutput, 'notes'),
        blogs: path.resolve(siteOutput, 'articles'),
        attachments: path.resolve(siteOutput, 'attachments'),
        objectResolver: path.resolve(siteOutput, 'object-resolver'),
        assets: {
            avatars: path.resolve(siteOutput, 'assets', 'avatars')
        }
    };

    makeOutputDirectories(output);

    return output;
};

export { setup };
