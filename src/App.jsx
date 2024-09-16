import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import "./index.css";

const RemoteStrategicApp = React.lazy(() => import("strategic/StrategicApp"));
const RemoteTacticalApp = React.lazy(() => import("tactical/TacticalApp"));
const RemoteNpcApp = React.lazy(() => import("npc/NpcApp"));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="main">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/strategic/*" element={<RemoteStrategicApp />} />
            <Route path="/tactical/*" element={<RemoteTacticalApp />} />
            <Route path="/npc/*" element={<RemoteNpcApp />} />
            <Route path="*" element={<div>404 Page not found!</div>} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
