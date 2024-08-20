"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const server_1 = require("react-dom/server");
const write_1 = tslib_1.__importDefault(require("write"));
const list_paths_1 = tslib_1.__importDefault(require("list-paths"));
const path_1 = tslib_1.__importDefault(require("path"));
const generateColorTerminal = (n) => `\x1b[${n}m%s\x1b[0m`;
const COLORS = {
    Reset: generateColorTerminal(0),
    Bright: generateColorTerminal(1),
    Dim: generateColorTerminal(2),
    Underscore: generateColorTerminal(4),
    Blink: generateColorTerminal(5),
    Reverse: generateColorTerminal(7),
    Hidden: generateColorTerminal(8),
    FgBlack: generateColorTerminal(30),
    FgRed: generateColorTerminal(31),
    FgGreen: generateColorTerminal(32),
    FgYellow: generateColorTerminal(33),
    FgBlue: generateColorTerminal(34),
    FgMagenta: generateColorTerminal(35),
    FgCyan: generateColorTerminal(36),
    FgWhite: generateColorTerminal(37),
    FgGray: generateColorTerminal(90),
    BgBlack: generateColorTerminal(40),
    BgRed: generateColorTerminal(41),
    BgGreen: generateColorTerminal(42),
    BgYellow: generateColorTerminal(43),
    BgBlue: generateColorTerminal(44),
    BgMagenta: generateColorTerminal(45),
    BgCyan: generateColorTerminal(46),
    BgWhite: generateColorTerminal(47),
    BgGray: generateColorTerminal(100),
};
const parseHTMLFunction = (HTML) => {
    const keyVar = 'GT_VAR_67629821984219841294706412';
    const HTMLFUNCTION = HTML.replaceAll('{{', `{{${keyVar}`);
    const HTMLOBJKEYS = {};
    const HTMLFUNCTIONVAR = HTMLFUNCTION.split(/\{\{|\}\}/g).map((e) => {
        if (e.includes(keyVar)) {
            const key = e.replaceAll(keyVar, '');
            HTMLOBJKEYS[key] = key;
            return `\${${key}}`;
        }
        return e;
    });
    const HTMLKEYS = Object.values(HTMLOBJKEYS);
    return `export const getTemplateEmail = ({${HTMLKEYS.join(',')}}:{[id in "${HTMLKEYS.join('"|"')}"]:string}) => \`${HTMLFUNCTIONVAR.join('')}\`;`;
};
const generate = async () => {
    console.log(COLORS.BgGreen, '------ INIT GENERATE -----');
    console.log('');
    const FOLDER = './src/pages';
    const pathList = (0, list_paths_1.default)(FOLDER, {
        includeFiles: true,
    }).filter((e) => e.split('/').at(-1) == 'index.tsx' && e != FOLDER + '/index.tsx');
    const pathListN = pathList.length;
    for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i];
        console.log(COLORS.FgGreen, `  (${i + 1}/${pathListN}) CREATE TEMPLATE FOR [${path}]`);
        const RUTE = path_1.default.resolve(process.cwd(), path);
        const RUTE_HTML = RUTE.replace('index.tsx', 'template.html');
        const RUTE_FUNCTION = RUTE.replace('index.tsx', 'function.ts');
        console.log(COLORS.FgYellow, `\t(1/4)`, COLORS.FgMagenta, ` - IMPORT COMPONENT [${path}]`);
        const COMPONENT = await Promise.resolve(`${RUTE}`).then(s => tslib_1.__importStar(require(s)));
        console.log(COLORS.FgYellow, `\t(2/4)`, COLORS.FgMagenta, ` - CREATE HTML [${path}]`);
        const HTML = (0, server_1.renderToStaticMarkup)(react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(COMPONENT.default, null)));
        console.log(COLORS.FgYellow, `\t(3/4)`, COLORS.FgMagenta, ` - CREATE TEMPLATE [${path}]`);
        write_1.default.sync(RUTE_HTML, `${HTML}`, {
            overwrite: true,
        });
        console.log(COLORS.FgYellow, `\t(4/4)`, COLORS.FgMagenta, ` - CREATE FUNCTION [${path}]`);
        write_1.default.sync(RUTE_FUNCTION, parseHTMLFunction(HTML), {
            overwrite: true,
        });
        console.log(COLORS.FgCyan, `  (${i + 1}/${pathListN}) FINISH CREATE TEMPLATE FOR [${path}]`);
        console.log('');
    }
    console.log(COLORS.BgGreen, '------ FINISH GENERATE -----');
};
generate();
//# sourceMappingURL=index.js.map