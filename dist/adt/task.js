import { Left, Right } from "./either";
export const Task = ((run) => ({
    run,
    map: (f) => Task(() => run().then((ea) => (ea._tag === "Right" ? Right(f(ea.right)) : ea))),
    chain: (f) => Task(() => run().then((ea) => ea._tag === "Right" ? f(ea.right).run() : Promise.resolve(ea))),
}));
Task.of = (a) => Task(() => Promise.resolve(Right(a)));
Task.reject = (e) => Task(() => Promise.resolve(Left(e)));
