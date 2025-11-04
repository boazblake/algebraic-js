import { IO } from "effects-vdom";
import type { Model } from "./types";
import { model } from "./model";

export const init = IO(() => ({ model, effects: [] }));
