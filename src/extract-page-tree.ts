import api, { Identifier } from './confluence/api';
import extractContent from './extract-content';
import { Output } from './output';

const extractPageTree = async (
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

export default extractPageTree;
