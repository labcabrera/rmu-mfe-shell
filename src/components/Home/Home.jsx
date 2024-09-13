import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div>
        This application provides a set of services for playing Rolemaster Unified developed by https://ironcrown.com/.
      </div>
      <div>
        It consists of the following modules:
      </div>
      <p>
        <ul>
          <li><a routerLink="/characters">Character generation</a>: allows the creation of characters, their customization and leveling up.</li>
          <li><a routerLink="/strategic-sessions">Strategic sessions</a>: equivalent to what would be a campaign within which there can be different tactical
            sessions.</li>
          <li><a routerLink="/tactical-sessions">Tactical sessions</a>: execution of actions that generally involve combat or maneuver situations.</li>
        </ul>
      </p>

      Under development.

    </div >
  );
};

export default Home;
