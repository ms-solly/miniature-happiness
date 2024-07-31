import { FC } from "react";

interface LogoIconProps {
  className?: string;
}

const LogoIcon: FC<LogoIconProps> = ({ className = "" }) => {
  return (
   <span className="w-10 h-10"></span>
  );
};

export default LogoIcon;
