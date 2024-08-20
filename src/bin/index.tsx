#!/usr/bin/env node

import { program } from 'commander';
import { generate } from '../lib/index';

program
    .command('generate')
    .description('Generate the application')
    .action(() => {
        generate();
    });

program.parse(process.argv);
