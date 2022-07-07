import path from 'path';
import fs from 'fs';
import api, { Content } from '../confluence/api';
import { Output } from '../output';

export const extractAttachments = async (content: Content, output: Output) => {
    const attachments = content.attachments;
    if (!attachments) return Promise.resolve();

    return Promise.all(
        attachments.map((attachment) => {
            return api
                .getAttachmentData(attachment.downloadUrl)
                .then(({ stream }) => {
                    const filePath = path.resolve(
                        output.attachments,
                        attachment.fileId
                    );
                    const file = fs.createWriteStream(filePath);
                    return stream.pipe(file);
                });
        })
    );
};
