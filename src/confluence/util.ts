import { config } from '../config';

const titleToPath = (title: string): string => {
    const noSpaces = title.replace(/\s+/g, '-');
    return noSpaces.replace(/[,?]/g, '');
};

const isInternalUrl = (url: string): boolean => {
    return url.startsWith(`https://${config.CONFLUENCE_SITE}`);
};

const blogUrl =
    /https:\/\/[a-z.]+\/wiki\/spaces\/[a-z]+\/blog\/\d+\/\d+\/\d+\/(?<id>\d+)/;

const pageUrl = /https:\/\/[a-z.]+\/wiki\/spaces\/[a-z]+\/pages\/(?<id>\d+)/;

const rewriteUrl = (url: string): string => {
    if (!isInternalUrl(url)) {
        return url;
    }
    const isBlog = url.match(blogUrl);
    if (isBlog) {
        return `${config.TARGET_SITE}/blogs/${isBlog.groups?.id}/`;
    }
    const isPage = url.match(pageUrl);
    if (isPage) {
        return `${config.TARGET_SITE}/pages/${isPage.groups?.id}/`;
    }
    return url;
};

export { titleToPath, rewriteUrl };
