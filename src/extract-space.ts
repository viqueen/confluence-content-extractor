import { Output } from './output';
import extractBlogs from './extract-blogs';
import api from './confluence/api';
import extractPageTree from './extract-page-tree';

const extractSpace = async (spaceKey: string, output: Output) => {
    console.info(`🎬 action : extract confluence ${spaceKey} space content`);

    const homePageIdentifier = await api.getSpaceHomepage(spaceKey);
    console.info(`🏠 processing space home: `, homePageIdentifier);

    await extractPageTree(homePageIdentifier, output, true);
    await extractBlogs(spaceKey, output);
};

export default extractSpace;
