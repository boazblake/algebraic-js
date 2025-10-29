import { IdEffect } from "./Id";
import { IOEffect } from "./IO";
import { MaybeEffect } from "./Maybe";
import { EitherEffect } from "./Either";
import { ReaderEffect } from "./Reader";
import { WriterEffect } from "./Writer";
import { StateEffect } from "./State";
import { TaskEffect } from "./Task";
import { ValidationEffect } from "./Validation";
import { StreamEffect } from "./Stream";
import { CompositionEffect } from "./Composition";
/**
 * Central registry for all demo effects.
 * Each effect is a pure view function of (Model, dispatch) -> vnode
 */
export const effects = new Map([
    ["Id", IdEffect],
    ["IO", IOEffect],
    ["Maybe", MaybeEffect],
    ["Either", EitherEffect],
    ["Reader", ReaderEffect],
    ["Writer", WriterEffect],
    ["State", StateEffect],
    ["Task", TaskEffect],
    ["Validation", ValidationEffect],
    ["Stream", StreamEffect],
    ["Composition", CompositionEffect],
]);
// Optional re-exports for direct imports
export { IdEffect, IOEffect, MaybeEffect, EitherEffect, ReaderEffect, WriterEffect, StateEffect, TaskEffect, ValidationEffect, StreamEffect, CompositionEffect, };
