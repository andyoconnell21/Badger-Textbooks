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
import React from "react";


class Login extends React.Component{
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
        window.location.href = '/createaccount'
      }

    render() {
        return (
          <div>
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

    export default Login
