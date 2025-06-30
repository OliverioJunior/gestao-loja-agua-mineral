import { HTMLAttributes } from "react";
import { HeaderMobile } from "./header-mobile";
import { HeaderDesktop } from "./header-desktop";

interface IHeader extends HTMLAttributes<HTMLHeadElement> {
  onClick: () => void;
}
export const Header: React.FC<IHeader> = ({ onClick, ...props }) => {
  return (
    <header {...props}>
      <HeaderMobile onMenuClick={onClick} />

      {/* Header Desktop */}
      <HeaderDesktop />
    </header>
  );
};
