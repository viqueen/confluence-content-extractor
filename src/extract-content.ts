import { Content } from './confluence/api';
import { Output } from './output';
import path from 'path';
import fs from 'fs';
import { titleToPath } from './confluence/util';
import extractObjects from './extract-objects';
import extractAttachments from './extract-attachments';
import extractAssets from './extract-assets';
import { scrubContent } from './confluence/adf-processor';

const shouldExtractContentData = (
    content: Content,
    output: Output
): boolean => {
    const targetDirectory =
        content.type === 'page' ? output.pages : output.blogs;
    const dataFile = path.resolve(
        targetDirectory,
        titleToPath(content.identifier.title),
        'data.json'
    );

    if (!fs.existsSync(dataFile)) return true;
    const fileStats = fs.statSync(dataFile);
    const lastTouched = fileStats.mtime.getTime();

    return lastTouched < content.lastModifiedDate;
};

const resolveContentPath = (content: Content, output: Output) => {
    if (content.asHomepage) {
        return output.home;
    }
    if (content.type === 'page') {
        return path.resolve(
            output.pages,
            titleToPath(content.identifier.title)
        );
    }
    return path.resolve(output.blogs, titleToPath(content.identifier.title));
};

const symlinkForInternals = (content: Content, output: Output) => {
    if (content.asHomepage) return;
    const directory = content.type === 'page' ? output.pages : output.blogs;
    const symlink = path.resolve(directory, content.identifier.id);
    if (fs.existsSync(symlink)) return;
    fs.symlinkSync(
        path.resolve(directory, titleToPath(content.identifier.title)),
        symlink
    );
};

const saveContentData = async (content: Content, output: Output) => {
    const scrubbed = scrubContent(content.adfBody);
    const data: Content = {
        ...content,
        adfBody: scrubbed,
        attachments: []
    };
    const contentPath = resolveContentPath(content, output);
    fs.mkdirSync(contentPath, { recursive: true });
    fs.writeFileSync(
        path.resolve(contentPath, 'data.json'),
        JSON.stringify(data)
    );
    symlinkForInternals(content, output);
};

const extractContent = async (content: Content, output: Output) => {
    if (shouldExtractContentData(content, output)) {
        console.info('▶️  extract content', content.identifier);
        await extractObjects(content, output);
        await extractAttachments(content, output);
        await extractAssets(content, output);
        await saveContentData(content, output);
    } else {
        console.log('⚡️  skipped data extraction', content.identifier);
    }
};

export default extractContent;
