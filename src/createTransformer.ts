import * as ts from "typescript";
import { IOptions } from './IOptions';

export function createTransformer(program: ts.Program, options: IOptions) {
    const checker = program.getTypeChecker();
    return (context: ts.TransformationContext) => {
        /**
         * 获取类的module链
         * @param node 
         * @returns 
         */
        const getClassParentModules = (node: ts.ClassDeclaration): string[] => {
            let parent = node.parent;
            let modules: string[] = [];
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
        }
        /**
         * 获取父类或接口的namespace
         * @param propertyAccessExpression 
         * @returns 
         */
        const getInterfaceNamespaces = (propertyAccessExpression: ts.PropertyAccessExpression): string | undefined => {
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
        }
        /**
         * 获取父类或接口的完整名称
         * @param node 
         * @param type 
         * @returns 
         */
        const getInterfaceName = (node: ts.ClassDeclaration, type: ts.ExpressionWithTypeArguments): string => {
            if (ts.isIdentifier(type.expression)) {
                let name = type.expression.getText();
                let modules = getClassParentModules(node);
                modules.push(name);
                return modules.join(".");
            }
            let propertyAccessExpression = type.expression as ts.PropertyAccessExpression;
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
        }

        /**
         * 获取类的父类和接口
         * @param node 
         * @returns 
         */
        const getClassInterfaces = (node: ts.ClassDeclaration): string[] => {
            let interfaces: string[] = [];
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
        }
        /**
         * 是否已经定义了类名的装饰器
         * @param node 
         * @returns 
         */
        const hasClassDecorator = (node: ts.ClassDeclaration): boolean => {
            if (node.decorators && node.decorators.length) {
                for (let decorator of node.decorators) {
                    const callExpression = decorator.expression as ts.CallExpression;
                    const text = callExpression.expression.getText();
                    if (options.classDecoratorNames.indexOf(text) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * 创建类名的装饰器
         * @param node 
         * @returns 
         */
        const createClassDecorator = (node: ts.ClassDeclaration): ts.ClassDeclaration | undefined => {
            if (hasClassDecorator(node)) {
                return undefined;
            }
            let names = getClassParentModules(node);
            if (node.name) {
                names.push(node.name.getText());
            }
            let className = names.join(".");
            const identifier = context.factory.createIdentifier(options.classDecorator);
            const classArguments: ts.StringLiteral[] = [];
            classArguments.push(context.factory.createStringLiteral(className))
            let interfaceNames = getClassInterfaces(node);
            if (interfaceNames.length) {
                for (let iname of interfaceNames) {
                    classArguments.push(context.factory.createStringLiteral(iname));
                }
            }
            const callExpression = context.factory.createCallExpression(identifier, undefined, classArguments);
            const decorator = context.factory.createDecorator(callExpression);
            const decorators = [decorator];
            return context.factory.updateClassDeclaration(node, decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members);
        }
        const transformer = (sourceFile: ts.SourceFile) => {
            const transformNode = (node: ts.Node): ts.Node | undefined => {
                if (ts.isClassDeclaration(node)) {
                    return createClassDecorator(node);
                }
                return ts.visitEachChild(node, visitor, context);
            }
            const visitor: ts.Visitor = (node) => transformNode(node);
            return ts.visitNode(sourceFile, visitor);
        };
        return transformer;
    };
};
export default createTransformer;