#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("../lib/index");
commander_1.program
    .command('generate')
    .description('Generate the application')
    .action(() => {
    (0, index_1.generate)();
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map