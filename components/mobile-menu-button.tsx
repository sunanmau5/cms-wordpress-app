import { Dispatch, SetStateAction } from "react";
import { Sling as Hamburger } from "hamburger-react";

interface IMobileMenuButtonProps {
  className?: string;
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
}

function MobileMenuButton(props: IMobileMenuButtonProps) {
  const { className, isNavOpen, setIsNavOpen } = props;
  return (
    <div className={className}>
      <Hamburger
        rounded
        duration={0.8}
        toggle={setIsNavOpen}
        toggled={isNavOpen}
      />
    </div>
  );
}
MobileMenuButton.displayName = "MobileMenuButton";

export { MobileMenuButton };
