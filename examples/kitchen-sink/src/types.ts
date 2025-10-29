import type { Writer } from "@/core/writer"; // adjust import path as needed

export type Model = {
  // core effects
  readerOutput?: string;
  writer: Writer<string[], any>;
  validationInput: string;
  validationError?: string;
  validationSuccess: boolean;
  taskLoading: boolean;
  taskResult?: string;

  // composed effects
  readerWriterResult?: string;
  validatedTaskStatus?: string;

  // ui state
  activeTab: string;
  sidebarOpen: boolean;
  showModal: boolean;
  width: number;
  height: number;
  theme: "light" | "dark" | string;

  // runtime trace
  lastEffect:
    | "none"
    | "reader"
    | "writer"
    | "validation"
    | "task"
    | "readerWriter"
    | "validatedTask";
};

export type Msg =
  | { type: "READER_RUN"; env: string }
  | { type: "WRITER_APPEND"; message: string }
  | { type: "VALIDATION_INPUT"; value: string }
  | { type: "TASK_RUN" }
  | { type: "TASK_RESOLVE"; result: string }
  | { type: "READER_WRITER_RUN"; env: string }
  | { type: "VALIDATED_TASK_RUN" }
  | { type: "OPEN_MODAL" }
  | { type: "CLOSE_MODAL" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "RESIZE"; width: number; height: number }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_THEME"; theme: string };
