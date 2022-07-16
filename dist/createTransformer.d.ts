import * as ts from "typescript";
import { IOptions } from './IOptions';
export declare function createTransformer(program: ts.Program, options: IOptions): (context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => ts.SourceFile;
export default createTransformer;
