import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav>
      <Link to="/">
        <h2>RMU Online</h2>
      </Link>
      <Link to="/characters">
        <p>Characters</p>
      </Link>
      <Link to="/strategic">
        <p>Strategic</p>
      </Link>
      <Link to="/tactical">
        <p>Tactical</p>
      </Link>
      <Link to="/npcs">
        <p>NPCs</p>
      </Link>
     </nav>
  );
};

export default Header;
