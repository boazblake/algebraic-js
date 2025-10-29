import { IO, Writer } from "effects-vdom";
export const init = IO(() => ({
    model: {
        activeView: "Id",
        theme: "light",
        width: window.innerWidth,
        height: window.innerHeight,
        // Writer<string[], string>
        writerEffect: Writer.of("", []),
    },
    effects: [],
}));
