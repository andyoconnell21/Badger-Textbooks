import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {
  Button,
  TextField,
  Grid,
  AppBar,
  Typography,
  Link,
  Container,
  } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateAccount from "./pages/CreateAccount"
import Home from "./pages/Home"
import Login from "./Login"
import React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyATKX78GgcgavgsRD0eUozsDAVQ1zpaEEs",
  authDomain: "badgertextbooks-2919f.firebaseapp.com",
  projectId: "badgertextbooks-2919f",
  storageBucket: "badgertextbooks-2919f.appspot.com",
  messagingSenderId: "83634428792",
  appId: "1:83634428792:web:8e85dff9a5ddaa76b1868d",
  measurementId: "G-TGR6BX114K"
};

var fire = firebase.initializeApp(firebaseConfig);



class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={() => <Login />}/>
            <Route path="/createaccount" exact component={() => <CreateAccount />}/>
            <Route path="/home" exact component={() => <Home />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
