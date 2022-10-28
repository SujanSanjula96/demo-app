import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './login/pages/Login';
import Providers from './providers';
import { Dashboard } from "./layout/dashboard";
import { SecureRoute, useAuthContext } from '@asgardeo/auth-react';
import { useHistory } from "react-router-dom"

const SecureRedirect = (props) => {
  const { component, path } = props;
  const { signIn } = useAuthContext();
  const history = useHistory();

  const callback = () => {
    history.push("/");
  };

  return (<SecureRoute path={path} component={component} callback={callback} />);
};

function App() {
  return (
    <div className="App">
      <Providers>
        <Router>
            <Route exact path="/" >
              <Login />
            </Route >
            <SecureRedirect path="/issues" component={Dashboard} />
        </Router>
      </Providers>
    </div>
  );
}

export default App;

