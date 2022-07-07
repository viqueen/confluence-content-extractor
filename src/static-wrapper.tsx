import React from 'react';
import { Content } from './confluence/api';
import { config } from './config';

const StaticWrapper = (content: Content) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content={config.TWITTER_SITE} />
                <meta name="twitter:title" content={content.identifier.title} />
                <meta name="twitter:description" content={content.excerpt} />
                <title>{content.identifier.title}</title>
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${config.GA_TRACKING_ID}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.GA_TRACKING_ID}');
          `
                    }}
                />
            </head>
            <body>
                <div id="root" />
            </body>
        </html>
    );
};

export { StaticWrapper };
