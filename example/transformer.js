const createTransformer = require("@rontian/typescript-xgame-transformer/dist").default;
console.log(createTransformer);
module.exports = (program) => ({ before: [createTransformer(program, { classDecorator: 'xgame.clazz', classDecoratorNames: ['xgame.clazz', 'clazz'] })] });