import { IO, Writer } from "effects-vdom";
import type { Model  } from "./types";

export const init = IO(() => ({
  model: {
    // Individual effects
    readerOutput: undefined,
    writer: Writer.of('', []),
    validationInput: "",
    validationError: undefined,
    validationSuccess: false,
    taskLoading: false,
    taskResult: undefined,

    // Compositions
    readerWriterResult: ['',[]],   // Reader→Writer composition output
    validatedTaskStatus: undefined,  // Validation→Task pipeline state or error

    // UI state
    activeTab: "Overview",
    sidebarOpen: false,
    showModal: false,
    width: window.innerWidth,
    height: window.innerHeight,
    theme: "light" as const,

    // Animation / visualization
    lastEffect: "none", // "reader" | "writer" | "validation" | "task" | "readerWriter" | "validatedTask"
  },
  effects: [],
}));
