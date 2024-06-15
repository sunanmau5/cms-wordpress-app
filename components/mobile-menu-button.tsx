import { Dispatch, SetStateAction } from "react";
import { Sling as Hamburger } from "hamburger-react";

interface IMobileMenuButtonProps {
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
}

function MobileMenuButton(props: IMobileMenuButtonProps) {
  const { isNavOpen, setIsNavOpen } = props;
  return (
    <Hamburger
      rounded
      duration={0.8}
      toggle={setIsNavOpen}
      toggled={isNavOpen}
    />
  );
}
MobileMenuButton.displayName = "MobileMenuButton";

export { MobileMenuButton };
