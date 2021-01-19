import { readFile } from "fs-extra";
import { join } from "path";
import { types, parse, visit } from "recast";


export const rootCodeMod = async (startingCode: string, ast: any, contentPath: string) => {
    if (startingCode.includes('start root codemod')) return;

    let code = await readFile(join(contentPath, 'root-codemod.js'), 'utf8');

    visit(ast, {
        visitCallExpression: function (path) {
            let callee = path?.value?.callee || null;
            if (callee.params && path.value.callee.params.length === 1 && path.value.callee.params[0].name === 'root') {
                callee.body = types.builders.blockStatement([...callee.body.body, ...parse(code, { quote: 'single' }).program.body]);
                return false;
            }
            this.traverse(path);
        }
    });
}

export const finishFunctionCodeMod = async (startingCode: string, ast: any, contentPath: string) => {
    if (startingCode.includes('start finish function codemod')) return;

    let code = await readFile(join(contentPath, 'finishFunction-codemod.js'), 'utf8');
    visit(ast, {
        visitFunctionDeclaration: function (path) {
            if (path.value && path.value.id && path.value.id.name && path.value.id.name === 'finish') {
                if (path.value.params && path.value.params.length === 1 && path.value.params[0].name === 'totalProgress') {
                    const codeAstNodes = parse(code, { quote: 'single' }).program.body;
                    let allBlocks = [...path.value.body.body, ...codeAstNodes];
                    let b = types.builders.blockStatement(allBlocks);
                    path.value.body = b;
                }

                return false;
            }
            this.traverse(path);
        }
    });
}

export const currentTimeArrayCodeMod = (startingCode: string, ast: any) => {
    visit(ast, {
        visitVariableDeclarator: function (path) {
            if (path.value && path.value.id.name === 'stuffToPick' && path.value.init.elements.length === 16) {
                let lit = types.builders.literal('GetCourseCurrentTime');
                lit.comments = [types.builders.commentBlock('stuffToPick GetCourseCurrentTime CodeMod', false, true)];
                path.value.init.elements.push(lit);
                return false;
            }
            this.traverse(path);
        }
    });
}

export const isTimeCompletedCodeMod = async (startingCode: string, ast: any, contentPath: string) => {
    if (startingCode.includes('start isTimeCompleted codemod')) return;

    let code = await readFile(join(contentPath, 'isTimeCompleted-codemod.js'), 'utf8');
    visit(ast, {
        visitCallExpression: function (path) {
            if (path.value && path.value.callee && path.value.callee.type === 'Identifier' && path.value.callee.name === 'finish') {
                if (path.value.arguments && path.value.arguments.length === 1 && path.value.arguments[0].value === 0) {
                    const codeAstNodes = parse(code, { quote: 'single' }).program.body;
                    path.parentPath.insertBefore(...codeAstNodes);
                }

                return false;
            }
            this.traverse(path);
        }
    });
}

export const completeOutCodeMod = async (startingCode: string, ast: any, contentPath: string) => {
    if (startingCode.includes('start completeOut function codemod')) return;

    let code = await readFile(join(contentPath, 'completeOutFunction-codemod.js'), 'utf8');

    visit(ast, {
        visitFunctionDeclaration: function (path) {
            if (path.value && path.value.id && path.value.id.name && path.value.id.name === 'completeOut') {
                visit(path.value.body, {
                    visitIfStatement: function (path) {
                        const codeAstNodes = parse(code, { quote: 'single' }).program.body;
                        path.insertBefore(...codeAstNodes);
                        return false;
                    }
                })

                return false;
            }
            this.traverse(path);
        }
    });
}

export const exitFunctionCodeMod = async (startingCode: string, ast: any, contentPath: string) => {
    if (startingCode.includes('start exit function codemod')) return;

    let code = await readFile(join(contentPath, 'exitFunction-codemod.js'), 'utf8');

    visit(ast, {
        visitFunctionDeclaration: function (path) {
            if (path.value && path.value.id && path.value.id.name && path.value.id.name === 'exit') {
                let blocks = parse(code, { quote: 'single' }).program.body;
                let block = types.builders.blockStatement(blocks);
                path.value.body = block;
                return false;
            }
            this.traverse(path);
        }
    });
}