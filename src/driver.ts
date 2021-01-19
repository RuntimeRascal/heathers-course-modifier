
import { JSDOM } from "jsdom";
import { readFile, writeFile } from "fs-extra";
import { join, basename } from "path";
import { types, parse, print, visit } from "recast";
import { completeOutCodeMod, currentTimeArrayCodeMod, exitFunctionCodeMod, finishFunctionCodeMod, isTimeCompletedCodeMod, rootCodeMod } from './indexScriptTagCodeMods';

export class Driver {
    dom: JSDOM;

    loadIndexHtml = async (filePath: string) => {
        let fileContents = await readFile(filePath, 'utf8');
        this.dom = new JSDOM(fileContents);
    }

    saveIndexHtml = async (filePath: string) => {
        let contents = this.dom.serialize();
        await writeFile(filePath, contents, { encoding: 'utf8', flag: 'w' });
    }

    getFragment = async (filePath: string) => {
        let fileContents = await readFile(filePath, 'utf8');
        return JSDOM.fragment(fileContents);
    }

    insertCustomIndexStyle = async (filePath: string, toFilePath: string) => {
        if (!this.dom) return;

        let fileContents = await readFile(filePath, 'utf8');
        await writeFile(toFilePath, fileContents, { encoding: 'utf8', flag: 'w' });

        let css = this.dom.window.document.createElement('link');
        css.type = `text/css`;
        css.rel = `stylesheet`;
        css.href = `./lib/${basename(toFilePath)}`;

        css.id = `${basename(filePath, '.css')}`;

        //css.setAttribute('itemprop', 'url');

        //css.appendChild(this.dom.window.document.createTextNode(fileContents));

        let customStyle = this.dom.window.document.getElementById(css.id);
        if (!customStyle) {
            let head = this.dom.window.document.getElementsByTagName('head')[0];
            //let idleDivElement = this.dom.window.document.getElementById('idleDiv');
            if (head)
                head.append(css);
            //idleDivElement.parentNode.insertBefore(css, idleDivElement);
        }
    }

    insertCustomCodeScriptInIndexHtml = async (contentDirPath: string, libDirPath: string) => {
        if (!this.dom) return;

        let fromFilePath = join(contentDirPath, 'custom-index-code.js');
        let toFilePath = join(libDirPath, 'custom-index-code.js');

        let fileContents = await readFile(fromFilePath, 'utf8');
        await writeFile(toFilePath, fileContents, { encoding: 'utf8', flag: 'w' });

        let script = this.dom.window.document.createElement('script');
        script.id = basename(fromFilePath, '.js');
        script.src = `./lib/${basename(toFilePath)}`;

        //script.appendChild(this.dom.window.document.createTextNode(fileContents));

        let customScript = this.dom.window.document.getElementById(script.id);
        if (!customScript) {
            let scripts = this.dom.window.document.getElementsByTagName('body')[0].getElementsByTagName('script');
            for (let index = 0; index < scripts.length; index++) {
                const s = scripts[index];
                if (s.src === '') {
                    s.parentNode.insertBefore(script, s);
                    break;
                }
            }
        }
    }

    insertPopupsMarkupInIndexHtml = async (filePath: string) => {
        if (!this.dom.window.document.getElementById('idleDiv')) {
            let fileContents = await readFile(filePath, 'utf8');
            let popupsContentFragment = JSDOM.fragment(fileContents);
            //TODO: update the time text

            let appElement = this.dom.window.document.getElementById('app');
            appElement.parentNode.insertBefore(popupsContentFragment, appElement);
        }
    }

    insertBodyTagEventHandlers = () => {
        let body = this.dom.window.document.getElementsByTagName('body')[0];
        if (!body.getAttribute('onkeydown'))
            body.setAttribute('onkeydown', 'fnResetIdleTime(600);');
        if (!body.getAttribute('onmousedown'))
            body.setAttribute('onmousedown', 'fnResetIdleTime(600);');
        if (!body.getAttribute('onload'))
            body.setAttribute('onload', 'fnOnPageLoad();');
    }

    getIndexHtmlScriptTag = () => {
        let body = this.dom.window.document.getElementsByTagName('body')[0];
        let scripts = body.getElementsByTagName('script');
        let scriptTag = null;
        for (let index = 0; index < scripts.length; index++) {
            const script = scripts[index];
            if (!script.id && !script.src) {
                scriptTag = script;
                break;
            }
        }
        return scriptTag;
    }

    applyIndexHtmlScriptTagCodeMods = async (contentPath: string) => {
        let scriptTag = this.getIndexHtmlScriptTag();

        const ast = parse(scriptTag.innerHTML, { quote: 'single' });

        currentTimeArrayCodeMod(scriptTag.innerHTML, ast);
        await isTimeCompletedCodeMod(scriptTag.innerHTML, ast, contentPath);
        await completeOutCodeMod(scriptTag.innerHTML, ast, contentPath);
        await exitFunctionCodeMod(scriptTag.innerHTML, ast, contentPath);
        await finishFunctionCodeMod(scriptTag.innerHTML, ast, contentPath);
        await rootCodeMod(scriptTag.innerHTML, ast, contentPath);

        scriptTag.innerHTML = print(ast, { quote: 'single' }).code;
        console.log(print(ast, { quote: 'single' }).code);
    }
}

export const modifyCourse = async (coursePath: string) => {
    const driver = new Driver();
    const indexFilePath = join(coursePath, 'scormcontent', 'index.html');
    const contentDirPath = join(coursePath, '../../', 'content');
    const libDirPath = join(coursePath, 'scormcontent', 'lib');

    await driver.loadIndexHtml(indexFilePath);

    driver.insertBodyTagEventHandlers();
    await driver.insertPopupsMarkupInIndexHtml(join(contentDirPath, 'popups.html'));
    await driver.insertCustomIndexStyle(join(contentDirPath, 'custom-index-styles.css'), join(libDirPath, 'custom-index-styles.css'));
    await driver.insertCustomCodeScriptInIndexHtml(contentDirPath, libDirPath);
    await driver.applyIndexHtmlScriptTagCodeMods(contentDirPath);

    await driver.saveIndexHtml(indexFilePath);
}