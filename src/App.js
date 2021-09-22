import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import 'draft-js/dist/Draft.css';
import React from 'react';
import { BrowserRouter as Router,Switch, Route} from "react-router-dom";
import Editor from "./Components/Editor"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Editor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
