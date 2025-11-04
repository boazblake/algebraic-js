// global.d.ts
declare global {
  interface Window {
    dispatch: (msg: any) => void;
    __INITIAL_MODEL__?: any;
  }
}
declare module "hyperscript";
declare module "hyperscript-helpers";
export {};
