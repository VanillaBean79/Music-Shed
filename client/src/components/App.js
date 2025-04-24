// App.js
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { UserContext } from "./UserContext";
import Home from "./Home";
import Signup from "./Signup";

function App() {
  const [user, setUser] = useState(null);

  // Check session when app loads
  useEffect(() => {
    fetch("/check_session")
      .then((r) => {
        if (r.ok) return r.json().then(setUser);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" component={Signup} />
          
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;


