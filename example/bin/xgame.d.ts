declare module xgame {
    class Demo implements IXObject {
        hashCode: number;
        constructor();
        echo(): void;
    }
}
declare module xgame {
    interface IXObject {
        hashCode: number;
    }
}
declare module xgame {
    class Panel {
        title: string;
        body: string;
        constructor(title: string, body: string);
        start(): void;
    }
}
declare module xgame {
    function clazz(className: string, ...interfaceNames: string[]): (target: any) => void;
}
