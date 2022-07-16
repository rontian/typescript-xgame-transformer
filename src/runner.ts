import * as ts from 'typescript';
import { IOptions } from './IOptions';
import createTransformer from './createTransformer';

function main(files: string[]) {
  // Normally these would be parsed from tsconfig.json
  const options: ts.CompilerOptions = {
    skipLibCheck: true,
    target: ts.ScriptTarget.ES5,
    outDir: 'built/',
    module: ts.ModuleKind.CommonJS,
    noEmitOnError: false
  };
  const compilerHost = ts.createCompilerHost(options);
  const program = ts.createProgram(files, options, compilerHost);
  const sampleTransformer = createTransformer(program, <IOptions>{
    classDecorator: 'xgame.clazz',
    classDecoratorNames: ['xgame.clazz', 'clazz']
  });
  const beforeTransforms = [sampleTransformer];
  const afterTransforms: ts.TransformerFactory<ts.SourceFile>[] = [];

  // Do the normal compilation flow


  const emitResult = program.emit(
    undefined, undefined, undefined, undefined,
    { before: beforeTransforms, after: afterTransforms });
}

const files = process.argv.slice(2);
main(files);
