import React, { ReactNode } from "react";
import Player from "./player";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      {children}
      <Player />
    </div>
  );
};

export default Layout;
