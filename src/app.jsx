import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AuthProvider, useAuth } from "./contexts/auth-context";
import AuthLoader from "./components/Auth/AuthLoader";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import AuthDebug from "./components/Auth/AuthDebug";
import "./index.css";

const RemoteStrategicApp = React.lazy(() => import("strategic/StrategicApp"));
const RemoteTacticalApp = React.lazy(() => import("tactical/TacticalApp"));
const RemoteNpcApp = React.lazy(() => import("npc/NpcApp"));

import theme from './theme';

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoader message="Initializing RMU Online..." />;
  }

  return (
    <div className="main">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          <Route path="/strategic/*"  element={
              <ProtectedRoute requireAuth={true}>
                <RemoteStrategicApp />
              </ProtectedRoute>
            } 
          />
          <Route path="/tactical/*" element={
              <ProtectedRoute requireAuth={true}>
                <RemoteTacticalApp />
              </ProtectedRoute>
            } 
          />
          <Route path="/npc/*" element={
              <ProtectedRoute requireAuth={true}>
                <RemoteNpcApp />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<div>404 Page not found!</div>} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
