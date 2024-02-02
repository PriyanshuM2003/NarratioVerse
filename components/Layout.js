import React from "react";
import Player from "./player";

const Layout = ({ children }) => {
  return (
    <div>
      {children}
      <Player />
    </div>
  );
};

export default Layout;
