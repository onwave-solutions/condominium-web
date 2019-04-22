export type BladeSize = "minimize" | "normal" | "full";

export interface IBladeWindow {
  size?: BladeSize;
}

export interface IBlade {
  id?: string;
  title: string;
  blade?: string;
  path?: string;
  route: string;
  loading?: boolean;
  parent?: string;
  window?: IBladeWindow;
}
