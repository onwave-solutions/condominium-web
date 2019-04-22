import { IModule } from "../../shared-ui/models/module";
import building from "../building/module";
import apartment from "../apartment/module";
import parking from "../parking/module";

export default {
  title: "Condominios",
  id: "condominium-parent",
  iconType: "lock",
  children: [
    {
      title: "Condominios",
      id: "condominium",
      iconType: "lock",
      route: "condominium"
    },
    building,
    apartment,
    parking
  ]
} as IModule;
