import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import "./index.css";

const RemoteCoreApp = React.lazy(() => import("core/CoreApp"));
const RemoteStrategicApp = React.lazy(() => import("strategic/StrategicApp"));
const RemoteTacticalApp = React.lazy(() => import("tactical/TacticalApp"));
const RemoteNpcApp = React.lazy(() => import("npc/NpcApp"));

import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/core/*" element={<RemoteCoreApp />} />
          <Route path="/strategic/*" element={<RemoteStrategicApp />} />
          <Route path="/tactical/*" element={<RemoteTacticalApp />} />
          <Route path="/npc/*" element={<RemoteNpcApp />} />
          <Route path="*" element={<div>404 Page not found!</div>} />
        </Routes>
      </Suspense>
      <Footer />
    </ThemeProvider>
  );
};

export default App;