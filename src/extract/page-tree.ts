import api, { Identifier } from '../confluence/api';
import { Output } from '../output';
import { extractContent } from './content';

export const extractPageTree = async (
    id: Identifier,
    output: Output,
    asHomepage = false
) => {
    const content = await api.getContentById(id, asHomepage);
    await extractContent(content, output);
    if (!content.children) return;

    for (const childId of content.children) {
        await extractPageTree(childId, output);
    }
};
