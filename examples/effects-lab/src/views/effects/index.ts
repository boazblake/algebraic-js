import type { Model, Msg } from "../../model/types";
import { IdEffect } from "./Id";
import { IOEffect } from "./IO";
import { ReaderEffect } from "./Reader";
import { WriterEffect } from "./Writer";
import { StateEffect } from "./State";
import { TaskEffect } from "./Task";
import { ValidationEffect } from "./Validation";
import { StreamEffect } from "./Stream";
import { EitherEffect } from "./Either";
import { MaybeEffect } from "./Maybe";
import { CompositionEffect } from "./Composition";

export type EffectView = (m: Model, dispatch: (msg: Msg) => void) => any;

export const effects = new Map<string, EffectView>([
  ["Id", IdEffect],
  ["IO", IOEffect],
  ["Reader", ReaderEffect],
  ["Writer", WriterEffect],
  ["State", StateEffect],
  ["Task", TaskEffect],
  ["Validation", ValidationEffect],
  ["Stream", StreamEffect],
  ["Either", EitherEffect],
  ["Maybe", MaybeEffect],
  ["Composition", CompositionEffect],
]);
