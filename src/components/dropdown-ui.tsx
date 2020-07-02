import { forwardRef } from "react";
import Link from "next/link";
import { Menu, MenuList, MenuItem, MenuButton, MenuLink } from "@reach/menu-button";
import {
  FiLogOut,
  FiBook,
  FiEdit3,
  FiSettings,
  FiSun,
  FiMoon
} from "react-icons/fi";
import { Routes } from "../utils/routes";
import { NavIcon } from "./icons";
import User from "./user";
import { useAuthContext } from "./auth";
import { useSettings } from "../reducers/app-state";

const NextMenuLink = forwardRef<HTMLAnchorElement, any>(({ to, ...props }, ref) => {
  return (
    <Link passHref href={to}>
      <a ref={ref} {...props} />
    </Link>
  );
});

export default function DropdownUI() {
  const [auth, { signOut }] = useAuthContext();
  const [settings, { toggleDarkMode }] = useSettings();

  return (
    <Menu>
      <MenuButton className="DropdownMenuButton">
        <NavIcon className="icon" />
      </MenuButton>
      <MenuList className="Sheet DropdownMenuList">
        {auth.name && (
          <User border colors={["#FEB692", "#EA5455"]} name={auth.name} />
        )}
        <MenuLink to={Routes.INDEX} as={NextMenuLink}>
          <span role="img" aria-label="Stack of books">
            <FiBook size={16} />
          </span>
          All Entries
        </MenuLink>
        <MenuLink to={Routes.NEW} as={NextMenuLink}>
          <span role="img" aria-label="Writing with a Pen">
            <FiEdit3 size={16} />
          </span>
          Create New Entry
        </MenuLink>
        <MenuLink to={Routes.SETTINGS} as={NextMenuLink}>
          <span role="img" aria-label="Gear">
            <FiSettings size={16} />
          </span>
          Settings
        </MenuLink>

        <MenuItem onSelect={() => toggleDarkMode()}>
          {settings.isDarkMode ? (
            <>
              <span role="img" aria-label="Sun smiling">
                <FiSun size={16} />
              </span>
              Switch to Light Mode
            </>
          ) : (
            <>
              <span role="img" aria-label="Moon">
                <FiMoon size={16} />
              </span>
              Switch to Dark Mode
            </>
          )}
        </MenuItem>
        <MenuItem onSelect={signOut}>
          <span role="img" aria-label="Fearful face">
            <FiLogOut size={16} />
          </span>
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
