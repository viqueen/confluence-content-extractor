import { ADFEntity } from '@atlaskit/adf-utils/dist/types/types';
import { rewriteUrl } from './util';
import { extension } from '@atlaskit/adf-utils/builders';
import { scrubAdf } from '@atlaskit/adf-utils/scrub';

const identityProcessor = (node: ADFEntity) => {
    return node;
};

const inlineCardProcessor = (node: ADFEntity) => {
    const url = rewriteUrl(node.attrs?.url);
    return {
        type: node.type,
        attrs: {
            url
        }
    };
};

const mediaSingleProcessor = (node: ADFEntity) => {
    return extension({
        extensionType: 'org.viqueen.media',
        extensionKey: 'file',
        parameters: {
            ...node.attrs,
            data: node.content
        }
    });
};

const emojiProcessor = (node: ADFEntity) => {
    const attrs = node.attrs || {};
    if (attrs.id === 'atlassian-check_mark')
        return { type: node.type, attrs: { ...attrs, text: '✅' } };
    if (attrs.id === 'atlassian-cross_mark')
        return { type: node.type, attrs: { ...attrs, text: '❌' } };
    if (attrs.id === 'atlassian-question_mark')
        return { type: node.type, attrs: { ...attrs, text: '❓' } };
    return node;
};

const scrubContent = (doc: any) => {
    return scrubAdf(doc, {
        nodeReplacements: {
            bulletList: identityProcessor,
            codeBlock: identityProcessor,
            emoji: emojiProcessor,
            expand: identityProcessor,
            extension: identityProcessor,
            heading: identityProcessor,
            inlineCard: inlineCardProcessor,
            inlineExtension: identityProcessor,
            media: identityProcessor,
            mediaSingle: mediaSingleProcessor,
            panel: identityProcessor,
            paragraph: identityProcessor,
            status: identityProcessor,
            table: identityProcessor,
            tableCell: identityProcessor,
            tableHeader: identityProcessor,
            tableRow: identityProcessor,
            text: identityProcessor
        }
    });
};

export { scrubContent };
