import { Left, Right } from "./either.js";
/** Main constructor */
export const Task = (run) => ({
    run,
    map: (f) => Task(() => run().then((ea) => (ea._tag === "Right" ? Right(f(ea.right)) : ea))),
    chain: (f) => Task(() => run().then((ea) => ea._tag === "Right" ? f(ea.right).run() : Promise.resolve(ea))),
    ap: (fb) => Task(() => fb
        .run()
        .then((ef) => ef._tag === "Right"
        ? run().then((ea) => ea._tag === "Right" ? Right(ef.right(ea.right)) : ea)
        : Promise.resolve(ef))),
    mapError: (f) => Task(() => run().then((ea) => (ea._tag === "Left" ? Left(f(ea.left)) : ea))),
    bimap: (onError, onSuccess) => Task(() => run().then((ea) => ea._tag === "Left" ? Left(onError(ea.left)) : Right(onSuccess(ea.right)))),
});
/** Static constructors */
Task.of = (a) => Task(() => Promise.resolve(Right(a)));
Task.reject = (e) => Task(() => Promise.resolve(Left(e)));
/** Utilities */
Task.tryCatch = (f) => Task(() => f().then(Right).catch(Left));
Task.tryCatchK = (f, onError) => Task(() => f()
    .then(Right)
    .catch((e) => Left(onError(e))));
/** Point-free combinators */
Task.map =
    (f) => (t) => t.map(f);
Task.chain =
    (f) => (t) => t.chain(f);
Task.ap =
    (fb) => (fa) => fa.ap(fb);
Task.mapError =
    (f) => (t) => t.mapError(f);
Task.bimap =
    (onError, onSuccess) => (t) => t.bimap(onError, onSuccess);
/** Fold - consume the Task */
Task.fold =
    (onError, onSuccess) => (t) => t
        .run()
        .then((ea) => ea._tag === "Left" ? onError(ea.left) : onSuccess(ea.right));
/** Get Right or default */
Task.getOrElse =
    (defaultValue) => (t) => t.run().then((ea) => (ea._tag === "Right" ? ea.right : defaultValue));
/** Delay execution */
Task.delay =
    (ms) => (t) => Task(() => new Promise((resolve) => setTimeout(() => t.run().then(resolve), ms)));
/** Timeout a task */
Task.timeout =
    (ms, onTimeout) => (t) => Task(() => Promise.race([
        t.run(),
        new Promise((resolve) => setTimeout(() => resolve(Left(onTimeout)), ms)),
    ]));
/** Sequence an array of Tasks (sequential execution) */
Task.sequence = (tasks) => Task(async () => {
    const results = [];
    for (const task of tasks) {
        const ea = await task.run();
        if (ea._tag === "Left")
            return ea;
        results.push(ea.right);
    }
    return Right(results);
});
/** Traverse an array */
Task.traverse =
    (f) => (arr) => Task.sequence(arr.map(f));
/** Parallel execution - all tasks must succeed */
Task.all = (tasks) => Task(async () => {
    const results = await Promise.all(tasks.map((t) => t.run()));
    const values = [];
    for (const ea of results) {
        if (ea._tag === "Left")
            return ea;
        values.push(ea.right);
    }
    return Right(values);
});
/** Race - return first to complete */
Task.race = (tasks) => Task(() => Promise.race(tasks.map((t) => t.run())));
/** From Either */
Task.fromEither = (e) => Task(() => Promise.resolve(e));
/** Convert to Promise (unsafe - throws on Left) */
Task.toPromise = (t) => t.run().then((ea) => {
    if (ea._tag === "Left")
        throw ea.left;
    return ea.right;
});
export default Task;
