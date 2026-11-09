import { createContext, FC, ReactNode, useContext, useState } from 'react';

type NavDrawer = { open: boolean; setOpen: (open: boolean) => void };

const NavDrawerContext = createContext<NavDrawer>({ open: false, setOpen: () => undefined });

/** Workspace spec 091, E8: the mobile drawer, in a state of its own so that opening it does not render the whole app. */
export const NavDrawerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return <NavDrawerContext.Provider value={{ open, setOpen }}>{children}</NavDrawerContext.Provider>;
};

export const useNavDrawer = () => useContext(NavDrawerContext);
