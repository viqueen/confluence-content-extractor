import { Output } from './output';
import api from './confluence/api';
import fs from 'fs';
import path from 'path';

const extractBlogs = async (spaceKey: string, output: Output) => {
    console.info('📙  extract blogs');
    const blogs = await api.getSpaceBlogs(spaceKey);
    fs.writeFileSync(
        path.resolve(output.home, 'blogs.json'),
        JSON.stringify(blogs)
    );
};

export default extractBlogs;
