"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransformer = void 0;
const ts = require("typescript");
function createTransformer(program, options) {
    const checker = program.getTypeChecker();
    return (context) => {
        /**
         * 获取类的module链
         * @param node
         * @returns
         */
        const getClassParentModules = (node) => {
            let parent = node.parent;
            let modules = [];
            while (parent) {
                if (ts.isModuleBlock(parent)) {
                    modules.unshift(parent.parent.name.getText());
                }
                parent = parent.parent;
                if (!parent) {
                    break;
                }
            }
            return modules;
        };
        /**
         * 获取父类或接口的namespace
         * @param propertyAccessExpression
         * @returns
         */
        const getInterfaceNamespaces = (propertyAccessExpression) => {
            let expression = propertyAccessExpression.expression;
            if (!expression) {
                return undefined;
            }
            let names = [];
            while (expression) {
                if (ts.isPropertyAccessExpression(expression)) {
                    names.unshift(expression.name.getText());
                    expression = expression.expression;
                }
                if (ts.isIdentifier(expression)) {
                    names.unshift(expression.getText());
                    break;
                }
            }
            return names.join('.');
        };
        /**
         * 获取父类或接口的完整名称
         * @param node
         * @param type
         * @returns
         */
        const getInterfaceName = (node, type) => {
            if (ts.isIdentifier(type.expression)) {
                let name = type.expression.getText();
                let modules = getClassParentModules(node);
                modules.push(name);
                return modules.join(".");
            }
            let propertyAccessExpression = type.expression;
            let name = propertyAccessExpression.name.getText();
            if (propertyAccessExpression.expression) {
                let ns = getInterfaceNamespaces(propertyAccessExpression);
                if (ns) {
                    name = ns + '.' + name;
                }
                return name;
            }
            else {
                let modules = getClassParentModules(node);
                modules.push(name);
                return modules.join(".");
            }
        };
        /**
         * 获取类的父类和接口
         * @param node
         * @returns
         */
        const getClassInterfaces = (node) => {
            let interfaces = [];
            if (node.heritageClauses) {
                for (let heritage of node.heritageClauses) {
                    if (heritage.types) {
                        for (let type of heritage.types) {
                            let name = getInterfaceName(node, type);
                            if (name) {
                                interfaces.push(name);
                            }
                        }
                    }
                }
            }
            return interfaces;
        };
        /**
         * 是否已经定义了类名的装饰器
         * @param node
         * @returns
         */
        const hasClassDecorator = (node) => {
            if (node.decorators && node.decorators.length) {
                for (let decorator of node.decorators) {
                    const callExpression = decorator.expression;
                    const text = callExpression.expression.getText();
                    if (options.classDecoratorNames.indexOf(text) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * 创建类名的装饰器
         * @param node
         * @returns
         */
        const createClassDecorator = (node) => {
            if (hasClassDecorator(node)) {
                return undefined;
            }
            let names = getClassParentModules(node);
            if (node.name) {
                names.push(node.name.getText());
            }
            let className = names.join(".");
            const identifier = context.factory.createIdentifier(options.classDecorator);
            const classArguments = [];
            classArguments.push(context.factory.createStringLiteral(className));
            let interfaceNames = getClassInterfaces(node);
            if (interfaceNames.length) {
                for (let iname of interfaceNames) {
                    classArguments.push(context.factory.createStringLiteral(iname));
                }
            }
            const callExpression = context.factory.createCallExpression(identifier, undefined, classArguments);
            const decorator = context.factory.createDecorator(callExpression);
            const decorators = [];
            if (node.decorators && node.decorators.length) {
                decorators.push(...node.decorators);
            }
            decorators.push(decorator);
            return context.factory.updateClassDeclaration(node, decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members);
        };
        const transformer = (sourceFile) => {
            const transformNode = (rootNode) => {
                const node = ts.visitEachChild(rootNode, visitor, context);
                if (ts.isClassDeclaration(node)) {
                    const update = createClassDecorator(node);
                    if (update) {
                        return update;
                    }
                }
                return node;
            };
            const visitor = (node) => transformNode(node);
            return ts.visitNode(sourceFile, visitor);
        };
        return transformer;
    };
}
exports.createTransformer = createTransformer;
;
exports.default = createTransformer;
//# sourceMappingURL=createTransformer.js.map