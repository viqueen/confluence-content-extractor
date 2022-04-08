import dotenv from 'dotenv';

export interface Configuration {
    CONFLUENCE_SITE: string;
    CONFLUENCE_USERNAME: string;
    CONFLUENCE_API_TOKEN: string;
    CONFLUENCE_SPACE: string;
}

const parsedConfig: unknown = dotenv.config().parsed!;
const config = parsedConfig as Configuration;

export { config };
