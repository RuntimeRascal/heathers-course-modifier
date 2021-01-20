
import { JSDOM } from "jsdom";
import { readFile, writeFile } from "fs-extra";
import { join, basename } from "path";
import { parse, print } from "recast";
import { completeOutCodeMod, currentTimeArrayCodeMod, exitFunctionCodeMod, finishFunctionCodeMod, isTimeCompletedCodeMod, loadContentCodeMod, rootCodeMod } from './indexScriptTagCodeMods';
import { logInfo, logMod } from './logger';
import { ISettings } from './cli';
import * as moment from 'moment';
import { scorm2004GetCourseCurrentTimeFuncCodeMod, aiccGetCourseCurrentTimeFuncCodeMod, scormGetCourseCurrentTimeFuncCodeMod, noneGetCourseCurrentTimeFuncCodeMod, tcapiGetCourseCurrentTimeFuncCodeMod, cmi5GetCourseCurrentTimeFuncCodeMod, getCourseCurrentTimeFuncCodeMod, concedeControlCodeMod, lmsStandardApiFuncCodeMod } from './scormDriverCodeMods';

export class Driver {
    dom: JSDOM;

    loadHtmlFile = async (filePath: string) => {
        logInfo(`reading '${filePath}' file`);
        let fileContents = await readFile(filePath, 'utf8');
        this.dom = new JSDOM(fileContents);
    }

    saveHtmlFile = async (filePath: string) => {
        logInfo(`persisting '${filePath}' file`);
        let contents = this.dom.serialize();
        await writeFile(filePath, contents, { encoding: 'utf8', flag: 'w' });
    }

    getFragment = async (filePath: string) => {
        let fileContents = await readFile(filePath, 'utf8');
        return JSDOM.fragment(fileContents);
    }

    insertCustomIndexStyle = async (filePath: string, toFilePath: string) => {
        logMod('insertCustomIndexStyle');

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

    insertCustomCodeScriptInIndexHtml = async (settings: ISettings, contentDirPath: string, libDirPath: string) => {
        logMod('insertCustomCodeScriptInIndexHtml');

        if (!this.dom) return;

        let fromFilePath = join(contentDirPath, 'custom-index-code.js');
        let toFilePath = join(libDirPath, 'custom-index-code.js');

        let fileContents = await readFile(fromFilePath, 'utf8');

        fileContents = `var idleTimer;
var idleTime = ${settings.idleTime}; // Add your timer time in millisecond
var countDownTimer;
var countDownTime = ${settings.countDownTime}; // Add your warning time in second
var isFromCountDown = false;
var courseTimer;
var courseCurrentTime = 0;
var courseTotalTime = ${settings.courseTotalTime}; // Add your course duration time in second
var isTimeCompleted = false; 

        ` + fileContents;

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

    insertPopupsMarkupInIndexHtml = async (settings: ISettings, filePath: string) => {
        logMod('insertPopupsMarkupInIndexHtml');
        if (!this.dom.window.document.getElementById('idleDiv')) {
            let fileContents = await readFile(filePath, 'utf8');
            let popupsContentFragment = JSDOM.fragment(fileContents);

            let tpcd = popupsContentFragment.getElementById('timerPopupCountDown');
            tpcd.innerHTML = `${settings.countDownTime}`;
            popupsContentFragment.getElementById('timer-popup-text-warning-time').innerHTML = `${settings.countDownTime}`;
            popupsContentFragment.getElementById('warning-popup-text-course-time').innerHTML = `${moment.duration(settings.courseTotalTime, 'seconds').humanize()}`;

            let appElement = this.dom.window.document.getElementById('app');
            appElement.parentNode.insertBefore(popupsContentFragment, appElement);
        }
    }

    insertBodyTagEventHandlers = (settings: ISettings) => {
        logMod('insertBodyTagEventHandlers');

        let body = this.dom.window.document.getElementsByTagName('body')[0];
        if (!body.getAttribute('onkeydown'))
            body.setAttribute('onkeydown', `fnResetIdleTime(${settings.idleTime});`);
        if (!body.getAttribute('onmousedown'))
            body.setAttribute('onmousedown', `fnResetIdleTime(${settings.idleTime});`);
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

    getIndexAPIHtmlScriptTag = () => {
        let body = this.dom.window.document.getElementsByTagName('head')[0];
        let scripts = body.getElementsByTagName('script');
        let scriptTag = null;
        for (let index = 0; index < scripts.length; index++) {
            const script = scripts[index];
            if (!script.type && !script.src && script.getAttribute('language')) {
                scriptTag = script;
                break;
            }
        }
        return scriptTag;
    }

    applyIndexHtmlScriptTagCodeMods = async (contentPath: string) => {
        logMod('applyIndexHtmlScriptTagCodeMods');

        let scriptTag = this.getIndexHtmlScriptTag();

        const ast = parse(scriptTag.innerHTML, { quote: 'single' });

        currentTimeArrayCodeMod(scriptTag.innerHTML, ast);
        await isTimeCompletedCodeMod(scriptTag.innerHTML, ast, contentPath);
        await completeOutCodeMod(scriptTag.innerHTML, ast, contentPath);
        await exitFunctionCodeMod(scriptTag.innerHTML, ast, contentPath);
        await finishFunctionCodeMod(scriptTag.innerHTML, ast, contentPath);
        await rootCodeMod(scriptTag.innerHTML, ast, contentPath);

        scriptTag.innerHTML = print(ast, { quote: 'single' }).code;
    }

    applyIndexAPIHtmlScriptTagCodeMods = async (contentPath: string) => {
        logMod('applyIndexAPIHtmlScriptTagCodeMods');

        let scriptTag = this.getIndexAPIHtmlScriptTag();

        // add getCourseCurrentTimeLMS variable
        scriptTag.innerHTML = `    var getCourseCurrentTimeLMS = ''; // Custom code added` + scriptTag.innerHTML;
        const ast = parse(scriptTag.innerHTML, { quote: 'single' });

        await loadContentCodeMod(scriptTag.innerHTML, ast, contentPath);

        scriptTag.innerHTML = print(ast, { quote: 'single' }).code;
    }

    applyScormDriverCodeMods = async (filePath, contentPath: string) => {
        logInfo(`reading '${filePath}' file`);

        let fileContents = await readFile(filePath, 'utf8');

        const ast = parse(fileContents, { quote: 'single' });

        await scorm2004GetCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await scormGetCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await aiccGetCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await noneGetCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await tcapiGetCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await cmi5GetCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await lmsStandardApiFuncCodeMod(fileContents, ast, contentPath);
        await getCourseCurrentTimeFuncCodeMod(fileContents, ast, contentPath);
        await concedeControlCodeMod(fileContents, ast, contentPath)

        let parsedCode = print(ast, { quote: 'single' }).code;

        logInfo(`persisting '${filePath}' file`);
        await writeFile(filePath, parsedCode, { encoding: 'utf8', flag: 'w' });
    }
}

export const modifyCourse = async (settings: ISettings) => {
    logInfo('applying code mods');
    const driver = new Driver();
    const indexFilePath = join(settings.paths.extractedCourse, 'scormcontent', 'index.html');
    const contentDirPath = join(settings.paths.extractedCourse, '../../', 'content');
    const libDirPath = join(settings.paths.extractedCourse, 'scormcontent', 'lib');

    await driver.loadHtmlFile(indexFilePath);
    driver.insertBodyTagEventHandlers(settings);
    await driver.insertPopupsMarkupInIndexHtml(settings, join(contentDirPath, 'popups.html'));
    await driver.insertCustomIndexStyle(join(contentDirPath, 'custom-index-styles.css'), join(libDirPath, 'custom-index-styles.css'));
    await driver.insertCustomCodeScriptInIndexHtml(settings, contentDirPath, libDirPath);
    await driver.applyIndexHtmlScriptTagCodeMods(contentDirPath);
    await driver.saveHtmlFile(indexFilePath);

    const indexAPIFilePath = join(settings.paths.extractedCourse, 'scormdriver', 'indexAPI.html');
    await driver.loadHtmlFile(indexAPIFilePath);
    await driver.applyIndexAPIHtmlScriptTagCodeMods(contentDirPath);
    await driver.saveHtmlFile(indexAPIFilePath);

    const scormDriverFilePath = join(settings.paths.extractedCourse, 'scormdriver', 'scormdriver.js');
    await driver.applyScormDriverCodeMods(scormDriverFilePath, contentDirPath);
}