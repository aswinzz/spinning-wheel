import './App.css';
import Home from './pages/home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
      <div>
        <Switch>
              <Route exact path='/' component={Home} />=
        </Switch>
      </div>
    </Router>
      
    </div>
  );
}

export default App;
