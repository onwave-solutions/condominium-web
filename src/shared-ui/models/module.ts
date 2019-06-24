export interface IModule {
  id: string;
  title: string;
  route?: string;
  loading?: boolean;
  iconType: string;
  parent?: string;
  permission?: string[];
  size?: "large" | "normal";
  children: IModule[];
  match?: any;
  history?: any;
  hide?: boolean;
}
