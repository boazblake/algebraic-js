import type { Writer } from "effects-vdom";

export type Theme = "light" | "dark";

export type Model = {
  activeView: string;
  theme: Theme;
  width: number;
  height: number;

  // Demos
  writerEffect: Writer<string[], string>;
  counter: number;

  // Last results for inspector
  id?: { input: number; mapped: number; chained: number };
  idError?: string;

  ioValue?: string;

  readerEnv?: { api: string };
  readerValue?: string;

  taskValue?: unknown; // Either<L,R> if you want

  validation?: unknown; // Validation<E,A>

  streamLast?: number;
  streamRunning?: boolean;
};

export type Msg =
  | { type: "SET_VIEW"; view: string }
  | { type: "SET_THEME"; theme: Theme }
  | { type: "RESIZE"; width: number; height: number }

  // Id
  | { type: "ID_RESULT"; value: { input: number; mapped: number; chained: number } }
  | { type: "ID_ERROR"; error: string }

  // IO
  | { type: "IO_RUN"; value: string }

  // Reader
  | { type: "READER_RUN"; value: string; env: { api: string } }

  // Writer
  | { type: "WRITER_UPDATE"; writerEffect: Writer<string[], string> }

  // State
  | { type: "STATE_SET"; value: number; last: number }

  // Task
  | { type: "TASK_DONE"; value: unknown }

  // Validation
  | { type: "VALIDATION_RUN"; result: unknown }

  // Stream
  | { type: "STREAM_NEXT"; value: number }
  | { type: "STREAM_START" }
  | { type: "STREAM_STOP" };
