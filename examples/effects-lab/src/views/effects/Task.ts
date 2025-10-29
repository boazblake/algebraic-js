import { h, Task, Right } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const TaskEffect = (_m: Model, dispatch: (msg: Msg) => void) => {
  const runTask = () => {
    const task = Task(() =>
      new Promise((resolve) => setTimeout(() => resolve(Right("Task complete ✅")), 1000))
    );
    task.run().then((e) => dispatch({ type: "TASK_DONE", value: e }));
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Task Monad"),
    h("button", { className: "w3-button w3-theme", onclick: runTask }, "Run Task"),
  ]);
};
