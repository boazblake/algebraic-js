export type VChild = VNode | string | number | boolean | null | undefined;

export type Props = Record<string, any> & {
  oncreate?: (el: Element) => void;
  onupdate?: (el: Element, oldProps: Props) => void;
  onremove?: (el: Element) => void;
};

export type VNode = {
  tag: string;
  props?: Props | null;
  children: VChild[];
  key?: string | number;
};
export type Dispatch = (msg: any) => void
