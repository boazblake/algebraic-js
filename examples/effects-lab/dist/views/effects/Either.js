import { h, Left, Right, foldEither as fold } from "effects-vdom";
export const EitherEffect = (_, __) => {
    const safeParse = (s) => {
        try {
            return Right(JSON.parse(s));
        }
        catch {
            return Left("Invalid JSON");
        }
    };
    const parsed = safeParse('{"ok":true}');
    const failed = safeParse("oops");
    const show = (e) => fold((l) => `Error: ${l}`, (r) => `Value: ${JSON.stringify(r)}`, e);
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Either (Error Handling)"),
        h("p", {}, "Models computations that may fail."),
        h("ul", {}, [
            h("li", {}, show(parsed)),
            h("li", {}, show(failed)),
        ]),
    ]);
};
