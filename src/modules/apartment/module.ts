import { IModule } from "../../shared-ui/models/module";

export default {
  title: "Apartamentos",
  id: "apartments",
  iconType: "lock",
  route: "apartment",
  children: [
    {
      title: "Apartamentos",
      id: "apartments/:id",
      iconType: "lock",
      route: "apartment"
    },
    {
      title: "Apartamentos",
      id: "apartment-list",
      iconType: "lock",
      route: "apartment"
    }
  ]
} as IModule;
