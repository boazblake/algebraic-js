import { IO, Writer } from "effects-vdom";
import type { Model } from "./types";

export const init = IO(() => ({
  model: {
    activeView: "Writer",
    theme: "light",
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,

    writerEffect: Writer<string[], string>(() => ["", []]),
    counter: 0,

    streamRunning: false,
  } as Model,
  effects: [] as any[],
}));
