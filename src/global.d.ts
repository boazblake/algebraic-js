export {};

declare global {
  interface Window {
    dispatch: (msg: any) => void;
  }
}
