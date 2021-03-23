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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from "react";


class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          email: '',
          password: '',
          hidden: false,
          forgotPasswordEmail: '',
          passwordError: false,
        }
        this.setErrorHandler = this.setErrorHandler.bind(this)
      }

      setErrorHandler(){
        this.setState({passwordError: true})
      } 
    
      setEmail = (event) => {
        this.setState({email: event.target.value})
      }
    
      setPassword = (event) => {
        this.setState({password: event.target.value})
      }

      setForgotEmailPassword = (event) => {
        this.setState({forgotPasswordEmail: event.target.value})
      }
    

      authWithAccountCreds = (event) => {
    
      }
    
      forgotPassword = (event) => {
        event.preventDefault()

        firebase.auth().sendPasswordResetEmail(this.state.forgotPasswordEmail).then((userCredential) => {
          // Email sent.
          this.setState({passwordError: false})
        })
        .catch((error) => {
          //Error Caught
          this.setErrorHandler(true);
          console.log(error)
        });
      }

      handleOpen = (event) => {
        this.setState({hidden:true})
      }

      handleClose = (event) => {
        this.setState({hidden:false})
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
                    <Link href="#" onClick={this.handleOpen} variant="body2">
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
              <Dialog open={this.state.hidden}>
                <DialogTitle >{"Reset Password"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter the email associated with your account
                  </DialogContentText>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    onChange = {this.setForgotEmailPassword}
                    error = {this.state.passwordError}
                    helperText = "No account associated with this email"
                    autoFocus
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.forgotPassword} color="primary">
                    Send
                  </Button>
                  <Button onClick={this.handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Container>
          </div>
        );
      }
    }

    export default Login
