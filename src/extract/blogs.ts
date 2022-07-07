import { Output } from '../output';
import api from '../confluence/api';
import fs from 'fs';
import path from 'path';
import extractContent from './content';

export const extractBlogs = async (spaceKey: string, output: Output) => {
    console.info('📙  extract blogs');
    const blogs = await api.getSpaceBlogs(spaceKey);

    for (const blog of blogs) {
        const content = await api.getContentById(blog.identifier);
        blog.cover = content.cover;
        await extractContent(content, output);
    }

    fs.writeFileSync(
        path.resolve(output.home, 'blogs.json'),
        JSON.stringify(blogs)
    );
};
