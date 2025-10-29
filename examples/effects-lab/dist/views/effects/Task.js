import { h, Task, Right } from "effects-vdom";
// Explicitly type the Task value
export const TaskEffect = (_, __) => {
    // Define the Task that resolves successfully after 1 second
    const fetchTask = Task(() => new Promise((resolve) => setTimeout(() => resolve(Right("Task resolved!")), 1000)));
    // map transforms the successful Right value
    const mapped = fetchTask.map((v) => v + " (mapped)");
    // chain creates a new Task based on the previous result
    const chained = fetchTask.chain((v) => Task(() => Promise.resolve(Right(v + " → chained"))));
    // Helper function to run the Task and handle the result
    const runTask = (t) => {
        void t.run().then((e) => {
            // pattern match on Either
            if (e._tag === "Right") {
                alert(e.right);
            }
            else {
                alert("Error occurred");
            }
        });
    };
    // View
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Task (asynchronous effect)"),
        h("p", {}, "Composes async computations like Promises."),
        h("button", {
            className: "w3-button w3-theme",
            onclick: () => runTask(mapped),
        }, "Run Mapped Task"),
        h("button", {
            className: "w3-button w3-border w3-margin-left",
            onclick: () => runTask(chained),
        }, "Run Chained Task"),
    ]);
};
