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
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  setEmail = (event) => {
    this.setState({email: event.target.value})
  }

  setPassword = (event) => {
    this.setState({password: event.target.state})
  }

  authWithAccountCreds = (event) => {

  }

  forgotPassword = (event) => {
    alert("Password link sent")
  }

  createAccount = (event) => {
    event.preventDefault();
    window.location.href = '/createaccount'
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/createaccount" exact component={() => <CreateAccount />}/>
          </Switch>
        </Router>
        <AppBar position = "static" style={{background:'#c5050c'}}>
          <Typography variant='h6' style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '25px', margin: '25px', textAlign: 'center'}}>
            Welcome to Badger Textbooks
          </Typography>
        </AppBar>

        <Container component="main" maxWidth="xs" style={{marginTop: '40px', fontFamily: 'sans-serif'}}>
          <Typography component="h1" variant="h4" style={{textAlign: 'center'}}>
            Sign in
          </Typography>
          <form onSubmit={this.authWithAccountCreds}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              onChange = {this.setEmail}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange = {this.setPassword}
            />
            <Button type="submit" style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '50%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Log In</Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" onClick={this.forgotPassword} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" onClick={this.createAccount} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    );
  }
}

export default App;
