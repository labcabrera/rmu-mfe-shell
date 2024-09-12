import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
const RemoteTacticalApp = React.lazy(() => import("tactical/TacticalApp"));

const App = () => {
  return (
    <div className="main">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tactical/*" element={<RemoteTacticalApp />} />
          <Route path="*" element={<div>404 Page not found!</div>} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;
