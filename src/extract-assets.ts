import path from 'path';
import fs from 'fs';
import api, { Content } from './confluence/api';
import { Output } from './output';

const extractAssets = async (content: Content, output: Output) => {
    const { author } = content;
    const avatarFile = path.resolve(
        output.assets.avatars,
        `${author.id}-avatar`
    );
    if (fs.existsSync(avatarFile)) {
        return;
    }
    await api.getAttachmentData(author.avatar, '').then(({ stream }) => {
        const file = fs.createWriteStream(avatarFile);
        return stream.pipe(file);
    });

    const symlink = path.resolve(output.assets.avatars, author.accountId);
    if (fs.existsSync(symlink)) return;
    fs.symlinkSync(avatarFile, symlink);
};

export default extractAssets;
