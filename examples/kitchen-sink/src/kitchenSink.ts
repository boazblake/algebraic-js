import { h } from "effects-vdom";
import type { Model, Msg } from "./types";

const colors = {
  reader: "green",
  writer: "blue",
  validation: "orange",
  task: "purple",
  composed: "teal",
};

export const KitchenSink = (m: Model, dispatch: (msg: Msg) => void) => {
  
  const Section = (title: string, body: any) =>
    h(
      "section",
      {
        className:
          "card round margin border animate-opacity padding",
      },
      h(
        "header",
        { className: "container light-grey border-bottom" },
        h("h2", { className: "medium" }, title)
      ),
      body
    );

  // Reader effect
  const Reader = Section(
    "Reader (environment)",
    h("div", { className: "container" }, [
      h("p", {}, "Reads a value from environment."),
      h(
        "button",
        {
          className: `button ${colors.reader}`,
          onclick: () =>
            dispatch({ type: "READER_RUN", env: "Current User: admin" }),
        },
        "Run Reader"
      ),
      m.readerOutput &&
        h("p", { className: "animate-opacity" }, m.readerOutput),
    ])
  );

  // Writer effect
const toVNode = (writer: Writer<string[], any>) => {
  const [_, logs] = writer.run();
  return h("ul", { className: "ul animate-opacity" },
    logs.map((l) => h("li", {}, l))
  );
};

const WriterSection = Section(
  "Writer (log accumulation)",
  h("div", { className: "container" }, [
    h("p", {}, "Appends messages to a writer log."),
    h(
      "button",
      {
        className: `button ${colors.writer}`,
        onclick: () => dispatch({ type: "WRITER_APPEND", message: "New log entry" }),
      },
      "Write Log"
    ),
    toVNode(m.writer)
  ])
);  // Validation effect
  const Validation = Section(
    "Validation (input)",
    h("div", { className: "container" }, [
      h("p", {}, "Validates email input in pure functional style."),
      h("input", {
        className: "input border margin-bottom",
        placeholder: "Enter email...",
        oninput: (e: any) =>
          dispatch({ type: "VALIDATION_INPUT", value: e.target.value }),
      }),
      m.validationError &&
        h(
          "div",
          {
            className:
              "panel pale-red border border-red round animate-opacity",
          },
          `Error: ${m.validationError}`
        ),
      m.validationSuccess &&
        h(
          "div",
          {
            className:
              "panel pale-green border border-green round animate-opacity",
          },
          "Valid email ✔"
        ),
    ])
  );

  // Task effect
  const Task = Section(
    "Task (async)",
    h("div", { className: "container" }, [
      h("p", {}, "Performs an async effectful task."),
      h(
        "button",
        {
          className: `button ${colors.task}`,
          onclick: () => dispatch({ type: "TASK_RUN" }),
        },
        "Start Task"
      ),
      m.taskLoading &&
        h(
          "div",
          {
            className: "container center padding animate-opacity",
          },
          h("div", { className: "spin jumbo text-theme" }, ":)")
        ),
      m.taskResult &&
        h("p", { className: "animate-opacity" }, m.taskResult),
    ])
  );

  // Reader → Writer composition
  const ReaderWriter = Section(
    "Composition: Reader → Writer",
    h("div", { className: "container" }, [
      h("p", {}, "Uses Reader value to write logs automatically."),
      h(
        "button",
        {
          className: `button ${colors.composed}`,
          onclick: () =>
            dispatch({
              type: "READER_WRITER_RUN",
              env: "Server ENV=production",
            }),
        },
        "Run Reader + Writer"
      ),
      h(
        "ul",
        { className: "ul small animate-opacity" },
        
    toVNode(m.writer)

      ),
    ])
  );

  // Validation → Task composition
  const ValidationTask = Section(
    "Composition: Validation → Task",
    h("div", { className: "container" }, [
      h("p", {}, "Only runs Task if Validation succeeds."),
      h("input", {
        className: "input border margin-bottom",
        placeholder: "Enter valid email to start task...",
        oninput: (e: any) =>
          dispatch({ type: "VALIDATION_INPUT", value: e.target.value }),
      }),
      h(
        "button",
        {
          className: `button ${colors.composed}`,
          onclick: () => dispatch({ type: "VALIDATED_TASK_RUN" }),
        },
        "Validate then Run Task"
      ),
      m.taskLoading &&
        h(
          "div",
          {
            className: "container center padding animate-opacity",
          },
          h("div", { className: "spin jumbo text-theme" }, ":)")
        ),
      m.taskResult &&
        h("p", { className: "animate-opacity" }, m.taskResult),
      m.validationError &&
        h(
          "div",
          { className: "panel pale-red round border" },
          m.validationError
        ),
    ])
  );

  // Visual composition pipeline
  const Pipeline = Section(
    "Effect Pipeline Visualization",
    h("div", { className: "center padding" }, [
      h("p", {}, "Compositional flow:"),
      h(
        "div",
        { className: "xlarge animate-left" },
        "Reader → Writer → Validation → Task"
      ),
      h(
        "div",
        {
          className: "panel round theme-l4 animate-opacity margin",
        },
        `Active: ${
          m.taskLoading
            ? "Task running..."
            : m.validationSuccess
            ? "Validation passed"
            : m.writer.length > 0
            ? "Writer logging"
            : m.readerOutput
            ? "Reader read"
            : "Idle"
        }`
      ),
    ])
  );

  return h(
    "div",
    { className: "container padding-32 animate-opacity" },
    Reader,
    WriterSection,
    Validation,
    Task,
    ReaderWriter,
    ValidationTask,
    Pipeline
  );
};
