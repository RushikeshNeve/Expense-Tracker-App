import React, { createContext, useContext, useState } from "react";

// Create Context
const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <DrawerContext.Provider value={{ showDrawer, setShowDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

// Custom Hook to use the Drawer Context
export const useDrawer = () => useContext(DrawerContext);
