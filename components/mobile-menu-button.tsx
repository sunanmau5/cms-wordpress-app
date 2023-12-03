import { Dispatch, SetStateAction } from "react";

import { Icons } from "./icons";

interface IMobileMenuButtonProps {
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
}

function MobileMenuButton(props: IMobileMenuButtonProps) {
  const { isNavOpen, setIsNavOpen } = props;
  const handleClick = () => setIsNavOpen((prev) => !prev);
  const Icon = isNavOpen ? Icons.x : Icons.menu;
  return <Icon onClick={handleClick} />;
}
MobileMenuButton.displayName = "MobileMenuButton";

export { MobileMenuButton };
