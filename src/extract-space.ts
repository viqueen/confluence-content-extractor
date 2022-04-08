import { Output } from './output';
import extractBlogs from './extract-blogs';

const extractSpace = async (spaceKey: string, output: Output) => {
    console.info(`🎬 action : extract confluence ${spaceKey} space content`);
    // const homePageIdentifier = await api.getSpaceHomepage(spaceKey);
    // console.info(`🏠 processing space home: `, homePageIdentifier);
    await extractBlogs(spaceKey, output);
};

export default extractSpace;
