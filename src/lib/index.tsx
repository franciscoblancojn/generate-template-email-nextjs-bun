import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// eslint-disable-next-line
// @ts-expect-error
import Bun from 'bun';

const generateColorTerminal = (n: number) => `\x1b[${n}m%s\x1b[0m`;

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

const parseHTMLFunction = (HTML: string) => {
    const keyVar = 'GT_VAR_67629821984219841294706412';

    const HTMLFUNCTION = HTML.replaceAll('{{', `{{${keyVar}`);

    const HTMLOBJKEYS: { [id: string]: string } = {};

    const HTMLFUNCTIONVAR = HTMLFUNCTION.split(/\{\{|\}\}/g).map((e) => {
        if (e.includes(keyVar)) {
            const key = e.replaceAll(keyVar, '');
            HTMLOBJKEYS[key] = key;
            return `\${${key}}`;
        }
        return e;
    });

    const HTMLKEYS: string[] = Object.values(HTMLOBJKEYS);

    return `export const getTemplateEmail = ({${HTMLKEYS.join(',')}}:{[id in "${HTMLKEYS.join('"|"')}"]:string}) => \`${HTMLFUNCTIONVAR.join('')}\`;`;
};

export const generate = async () => {
    console.log(COLORS.BgGreen, '------ INIT GENERATE -----');
    console.log('');

    const glob = new Bun.Glob('**/*.tsx');

    const pathList: string[] = [];

    for await (const path of glob.scan('./src/pages')) {
        if (`${path}`.split('/').at(-1) == 'index.tsx' && path != 'index.tsx') {
            pathList.push(path);
        }
    }

    const pathListN = pathList.length;

    for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i];
        console.log(
            COLORS.FgGreen,
            `  (${i + 1}/${pathListN}) CREATE TEMPLATE FOR [${path}]`,
        );

        const RUTE = `./src/pages/${path}`;

        const RUTE_HTML = RUTE.replace('index.tsx', 'template.html');
        const RUTE_FUNCTION = RUTE.replace('index.tsx', 'function.tsx');

        console.log(
            COLORS.FgYellow,
            `\t(1/4)`,
            COLORS.FgMagenta,
            ` - IMPORT COMPONENT [${path}]`,
        );
        const COMPONENT = await import('.' + RUTE);

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
        await Bun.write(RUTE_HTML, `${HTML}`, {
            createDirs: true,
        });

        console.log(
            COLORS.FgYellow,
            `\t(4/4)`,
            COLORS.FgMagenta,
            ` - CREATE FUNCTION [${path}]`,
        );
        await Bun.write(RUTE_FUNCTION, parseHTMLFunction(HTML), {
            createDirs: true,
        });

        console.log(
            COLORS.FgCyan,
            `  (${i + 1}/${pathListN}) FINISH CREATE TEMPLATE FOR [${path}]`,
        );
        console.log('');
    }

    console.log(COLORS.BgGreen, '------ FINISH GENERATE -----');
};
