import { Reader, IO } from "../../../node_modules/effects-vdom/dist/index.js";
type Env = { window: Window };

export const registerGlobalIO = (dispatch: (msg: any) => void) =>
  Reader<Env, IO<() => void>>((env) =>
    IO(() => {
      const resize = () =>
        dispatch({
          type: "RESIZE",
          width: env.window.innerWidth,
          height: env.window.innerHeight,
        });

      env.window.addEventListener("resize", resize);
      resize();
      return () => env.window.removeEventListener("resize", resize);
    })
  );
