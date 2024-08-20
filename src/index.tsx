import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import write from 'write';
import listPaths from 'list-paths';
import PATH from 'path';

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

    return `const getTemplateEmail = ({${HTMLKEYS.join(',')}}) => \`${HTMLFUNCTIONVAR.join('')}\`; module.exports = {getTemplateEmail}`;
};

const generate = async () => {
    console.log(COLORS.BgGreen, '------ INIT GENERATE -----');
    console.log('');

    const FOLDER = './src/pages';

    const pathList = listPaths(FOLDER, {
        includeFiles: true,
    }).filter(
        (e) => e.split('/').at(-1) == 'index.tsx' && e != FOLDER + '/index.tsx',
    );

    const pathListN = pathList.length;

    for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i];
        console.log(
            COLORS.FgGreen,
            `  (${i + 1}/${pathListN}) CREATE TEMPLATE FOR [${path}]`,
        );

        const RUTE = PATH.resolve(process.cwd(), path);

        const RUTE_HTML = RUTE.replace('index.tsx', 'template.html');
        const RUTE_FUNCTION = RUTE.replace('index.tsx', 'function.js');

        console.log(
            COLORS.FgYellow,
            `\t(1/4)`,
            COLORS.FgMagenta,
            ` - IMPORT COMPONENT [${path}]`,
        );
        const COMPONENT = await import(RUTE);

        console.log(
            COLORS.FgYellow,
            `\t(2/4)`,
            COLORS.FgMagenta,
            ` - CREATE HTML [${path}]`,
        );
        const HTML = renderToStaticMarkup(
            <>
                <COMPONENT.default />
            </>,
        );

        console.log(
            COLORS.FgYellow,
            `\t(3/4)`,
            COLORS.FgMagenta,
            ` - CREATE TEMPLATE [${path}]`,
        );
        write.sync(RUTE_HTML, `${HTML}`, {
            overwrite: true,
        });

        console.log(
            COLORS.FgYellow,
            `\t(4/4)`,
            COLORS.FgMagenta,
            ` - CREATE FUNCTION [${path}]`,
        );
        write.sync(RUTE_FUNCTION, parseHTMLFunction(HTML), {
            overwrite: true,
        });

        console.log(
            COLORS.FgCyan,
            `  (${i + 1}/${pathListN}) FINISH CREATE TEMPLATE FOR [${path}]`,
        );
        console.log('');
    }

    console.log(COLORS.BgGreen, '------ FINISH GENERATE -----');
};

generate();
