import Menu from "../../atoms/menu";
import withDropdownMenuStyle from "../../hoc/with-dropdown-menu-style";

export default withDropdownMenuStyle(Menu);
export const SubMenu = withDropdownMenuStyle(Menu.SubMenu);
export const Item = withDropdownMenuStyle(Menu.Item);
