## confluence-content-extractor

Library to extract structured content from Confluence with all the metadata and properties
required for static site rendering.

It resolves content and media assets for a given Confluence Space.

```
npm install confluence-content-extractor --save-dev

./node_modules/.bin/confsite extract spaceKey
```

---

## development

### environment

- [NodeJS](https://nodejs.org/en/)
- optional: [nvm](https://github.com/nvm-sh/nvm)

### build it, test it, and format it

#### locally

```bash
npm run build
npm test
npm run format
```

#### on a build agent

```bash
npm run ci:build
npm run ci:test
npm run format:check
```
