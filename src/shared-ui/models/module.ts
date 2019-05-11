export interface IModule {
  id: string;
  title: string;
  route: string;
  loading?: boolean;
  iconType: string;
  parent?: string;
  children: IModule[];
}
