import { readFile } from "fs-extra";
import { join } from "path";
import { types, parse, visit } from "recast";
import { logMod } from './logger';

/* inserts code after a function declaration */
export const insertCodeAfterFunctionDeclaration = (ast: types.ASTNode, functionName: string, code: string) => {
    visit(ast, {
        visitFunctionDeclaration: function (path) {
            if (path.value && path.value.id && path.value.id.name && path.value.id.name === functionName) {
                const codeAstNodes = parse(code, { quote: 'single' }).program.body;
                path.insertAfter(...codeAstNodes);

                return false;
            }
            this.traverse(path);
        }
    });
}

export const scorm2004GetCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('scorm2004GetCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start SCORM2004_GetCourseCurrentTime codemod')) return;

    let code = await readFile(join(contentPath, 'scorm2004GetCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'SCORM2004_GetBookmark', code);
}

export const scormGetCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('scormGetCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start SCORM_GetCourseCurrentTime codemod')) return;

    let code = await readFile(join(contentPath, 'scormGetCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'SCORM_GetBookmark', code);
}

export const aiccGetCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('aiccGetCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start AICC_GetCourseCurrentTime codemod')) return;

    let code = await readFile(join(contentPath, 'aiccGetCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'AICC_GetBookmark', code);
}

export const noneGetCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('noneGetCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start NONE_GetCourseCurrentTime codemod')) return;

    let code = await readFile(join(contentPath, 'noneGetCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'NONE_GetBookmark', code);
}

export const tcapiGetCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('tcapiGetCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start TCAPI_GetCourseCurrentTime  codemod')) return;

    let code = await readFile(join(contentPath, 'tcapiGetCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'TCAPI_GetBookmark', code);
}

export const cmi5GetCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('cmi5GetCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start CMI5_GetCourseCurrentTime codemod')) return;

    let code = await readFile(join(contentPath, 'cmi5GetCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'CMI5_GetBookmark', code);
}

export const getCourseCurrentTimeFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('getCourseCurrentTimeFuncCodeMod');

    if (startingCode.includes('start GetCourseCurrentTime codemod')) return;

    let code = await readFile(join(contentPath, 'getCourseCurrentTime-codemod.js'), 'utf8');
    insertCodeAfterFunctionDeclaration(ast, 'GetBookmark', code);
}

export const concedeControlCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('concedeControlCodeMod');

    if (startingCode.includes('start ConcedeControl codemod')) return;

    let code = await readFile(join(contentPath, 'concedeControl-codemod.js'), 'utf8');
    let didCodeMod = false;
    visit(ast, {
        visitFunctionDeclaration: function (path) {
            if (path.value && path.value.id && path.value.id.name && path.value.id.name === 'ConcedeControl') {
                visit(path.value.body, {
                    visitIfStatement: function (path) {
                        if (didCodeMod) return false;
                        const codeAstNodes = parse(code, { quote: 'single' }).program.body;
                        path.insertBefore(...codeAstNodes);
                        didCodeMod = true;
                        return false;
                    }
                })

                return false;
            }
            this.traverse(path);
        }
    });
}

export const lmsStandardApiFuncCodeMod = async (startingCode: string, ast: types.ASTNode, contentPath: string) => {
    logMod('lmsStandardApiFuncCodeMod');

    if (startingCode.includes('start LMSStandardAPI codemod')) return;

    let code = await readFile(join(contentPath, 'lmsStandard-codemod.js'), 'utf8');

    visit(ast, {
        visitFunctionDeclaration: function (path) {
            if (path.value && path.value.id && path.value.id.name && path.value.id.name === 'LMSStandardAPI') {
                visit(path.value.body, {
                    visitExpressionStatement: function (path) {
                        if (path.value.expression && path.value.expression.arguments && path.value.expression.arguments[0].left && path.value.expression.arguments[0]) {
                            if (path.value.expression.arguments[0].left && path.value.expression.arguments[0].left.left && path.value.expression.arguments[0].left.left.value) {
                                let l = path.value.expression.arguments[0].left.left.value;
                                if (l === 'this.CreateValidIdentifier = ') {
                                    const codeAstNodes = parse(code, { quote: 'single' }).program.body;

                                    path.insertAfter(...codeAstNodes);
                                    return false;
                                }
                            }
                        }
                        this.traverse(path);
                    }
                });

                return false;
            }
            this.traverse(path);
        }
    });
}