// global.d.ts
declare global {
  interface Window {
    dispatch: (msg: any) => void;
    __INITIAL_MODEL__?: any;
  }
}
export {};
