import { h, ValidationSuccess, ValidationFailure } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const ValidationEffect = (_m: Model, dispatch: (msg: Msg) => void) => {
  let input = "";

  const validate = () => {
    const result = input.includes("@")
      ? ValidationSuccess(input)
      : ValidationFailure(["Invalid email"]);
    dispatch({ type: "VALIDATION_RUN", result });
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Validation Monad"),
    h("input", {
      className: "w3-input w3-border w3-margin-bottom",
      value: input,
      oninput: (e: any) => (input = e.target.value),
      placeholder: "Enter email...",
    }),
    h("button", { className: "w3-button w3-theme", onclick: validate }, "Validate"),
  ]);
};
