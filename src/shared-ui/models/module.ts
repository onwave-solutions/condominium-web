export interface IModule {
  id: string;
  title: string;
  isTenant?: boolean
  route?: string;
  loading?: boolean;
  iconType: string;
  fromParent?: boolean
  parent?: string;
  permission?: string[];
  isInitialSetup?: boolean
  size?: "large" | "normal";
  children: IModule[];
  match?: any;
  history?: any;
  hide?: boolean;
}
