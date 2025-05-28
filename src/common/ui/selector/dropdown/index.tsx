import DropdownContainer from "./Dropdown";
import DropdownTrigger from "./DropdownTrigger";
import DropdownMenu from "./DropdownMenu";
import DropdownItem from "./DropdownItem";

type DropdownType = typeof DropdownContainer & {
  Trigger: typeof DropdownTrigger;
  Menu: typeof DropdownMenu;
  Item: typeof DropdownItem;
};

const CompoundDropdown = DropdownContainer as DropdownType;

CompoundDropdown.Trigger = DropdownTrigger;
CompoundDropdown.Menu = DropdownMenu;
CompoundDropdown.Item = DropdownItem;

export default CompoundDropdown;
