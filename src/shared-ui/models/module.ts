export interface IModule {
  id: string;
  title: string;
  route: string;
  iconType: string;
  children: IModule[];
}
