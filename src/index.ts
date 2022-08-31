#! /usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { setup } from './output';
import { extractBlogs, extractContentById, extractSpace } from './extract';

const program = new Command();

program
    .command('extract <spaceKey>')
    .description('extract all content and media from a confluence space')
    .action(async (spaceKey: string) => {
        const outputDirectory = path.resolve(process.cwd(), 'output');
        const output = setup(outputDirectory);
        await extractSpace(spaceKey, output);
    });

program
    .command('extract-blogs <spaceKey>')
    .description('extract all blogs from a confluence space')
    .action(async (spaceKey: string) => {
        const outputDirectory = path.resolve(process.cwd(), 'output');
        const output = setup(outputDirectory);
        await extractBlogs(spaceKey, output);
    });

program
    .command('extract-content <contentId>')
    .description('extract specific content from a confluence space')
    .option('-f, --force', 'force extraction', false)
    .action(async (contentId: string, options) => {
        const outputDirectory = path.resolve(process.cwd(), 'output');
        const output = setup(outputDirectory);
        await extractContentById({ id: contentId }, output, options);
    });

program.version(require('../package.json').version);
program.parse(process.argv);
