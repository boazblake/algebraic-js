import { h, Stream } from "effects-vdom";
// Define the StreamEffect component
export const StreamEffect = (_, __) => {
    // Create a Stream that emits numbers every 500ms
    const counter = Stream((observer) => {
        let n = 0;
        const id = setInterval(() => observer.next(n++), 500);
        return () => clearInterval(id); // cleanup
    });
    const start = () => {
        const unsubscribe = counter.subscribe({
            next: (val) => console.log("stream value:", val),
            complete: () => console.log("stream complete"),
        });
        setTimeout(unsubscribe, 3000);
    };
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Stream (event stream effect)"),
        h("p", {}, "Emits an incrementing value every 500ms."),
        h("button", {
            className: "w3-button w3-theme",
            onclick: () => start(),
        }, "Start Stream"),
    ]);
};
