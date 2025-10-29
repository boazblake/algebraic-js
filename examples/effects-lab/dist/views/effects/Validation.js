import { h, ValidationSuccess as Success, ValidationFailure as Failure } from "effects-vdom";
// Small helper to safely chain Validation effects
const chainValidation = (v, f) => v._tag === "Success" ? f(v.value) : v;
export const ValidationEffect = (_, __) => {
    const isEmail = (s) => s.includes("@") ? Success(s) : Failure(["Invalid email"]);
    const minLength = (s) => s.length >= 5 ? Success(s) : Failure(["Too short"]);
    const composed = chainValidation(isEmail("foo@bar.com"), minLength);
    const failed = chainValidation(isEmail("nope"), minLength);
    const renderValidation = (v) => v._tag === "Success"
        ? ` Success: ${v.value}`
        : ` Errors: ${v.errors.join(", ")}`;
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Validation (applicative validation)"),
        h("p", {}, "Composes multiple validation checks functionally."),
        h("ul", {}, [
            h("li", {}, renderValidation(composed)),
            h("li", {}, renderValidation(failed)),
        ]),
    ]);
};
