module xgame {
    export function clazz(className: string, ...interfaceNames: string[]) {
        return function (target: any) {
            target.__class__ = className;
            if (interfaceNames.length) {
                if (target.__implements__) {
                    target.__implements__.push(...interfaceNames);
                }
                else {
                    target.__implements__ = interfaceNames;
                }
            }
        }
    }
}