#! /usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { setup } from './output';
import extractSpace from './extract-space';

const program = new Command();

program
    .command('extract <spaceKey>')
    .description('extract all content and media from a confluence space')
    .action(async (spaceKey: string) => {
        const outputDirectory = path.resolve(__dirname, '../output');
        const output = setup(outputDirectory);
        await extractSpace(spaceKey, output);
    });

program.version('1.0.0');
program.parse(process.argv);
