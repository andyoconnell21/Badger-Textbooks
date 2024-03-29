import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Logo from './BadgerTextbooksLogoV1.png';

import React from "react";
import {
  Button,
  TextField,
  Grid,
  AppBar,
  Typography,
  Link,
  Container,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          email: '',
          password: '',
          hidden: false,
          forgotPasswordEmail: '',
          passwordError: false,
          verified: false,
          invalidEmail: false,
          invalidPassword: false,
          incorrectEmail: false
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
        event.preventDefault();

        var splitEmail = this.state.email.split("@")
        if(splitEmail[1] !== 'wisc.edu'){
            this.setState({incorrectEmail: true})
        }
        else{
          firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          .then((userCredential) => {
            //Check to make sure user email is authenticated
            var user = firebase.auth().currentUser
            if(user != null){
              if(user.emailVerified === true){
                this.setState({verified: false})
              }
              else{
                this.setState({verified:true})
              }
            }
            if(this.state.verified === false){
              window.location.href = '/home'
            }
            //set info in localstorage
            // localStorage.setItem('email', this.state.email);
            // localStorage.setItem('password', this.state.password);
            // localStorage.setItem('userStatus', 'customer');
          })
          .catch((error) => {
            //Wrong Account Information
            if(error.code === "auth/user-not-found"){
              this.setState({invalidEmail: true})
            }
            if(error.code === "auth/wrong-password"){
              this.setState({invalidPassword: true})
            }
          });
        }
      }
    
      forgotPassword = (event) => {
        event.preventDefault()

        firebase.firestore().collection('users').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if(this.state.forgotPasswordEmail === doc.data().email){
              firebase.auth().sendPasswordResetEmail(this.state.forgotPasswordEmail).then((userCredential) => {
                // Email sent.
                this.setState({passwordError: false})
              })
              .catch((error) => {
                //Error Caught
                this.setErrorHandler(true);
              });
            }
            else{
              this.setErrorHandler(true)
            }
          })
        })


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

      handleEmailClose = (event) => {
        this.setState({verified:false})
      }

      handleWrongLoginInfo = (event) => {
        this.setState({
          invalidPassword: false,
          invalidEmail: false,
          incorrectEmail: false
        })
      }

      sendVerificationEmail = (event) => {
        //Send verification email to user
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
          //Email sent.
        }).catch(function(error) {
          //An error happened.
        });
      }

    render() {
        return (
          <div>
            <AppBar position = "static" style={{background:'#c5050c'}}>
              <Typography style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', textAlign: 'center'}}>
                <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Welcome to Badger Textbooks
              </Typography>
            </AppBar>
    
            <Container component="main" maxWidth="xs" style={{marginTop: '40px', fontFamily: 'sans-serif'}}>
              <Typography component="h1" variant="h4" style={{textAlign: 'center'}}>
                Sign In
              </Typography>

              <form onSubmit={this.authWithAccountCreds}>
                <TextField
                  title = 'emailTextInput'
                  data-testid="emailTextInput"
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
                  title = 'passwordTextInput'
                  data-testid="passwordTextInput"
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
                <Button title='login_btn' type="submit" style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '50%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>SIGN IN</Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" title='forgotPassword' onClick={this.handleOpen} variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" title='create_account' onClick={this.createAccount} variant="body2">
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
                    data-testid="forgot_email"
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
                  <Button title='close_btn' onClick={this.handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={this.state.verified}>
                <DialogTitle >{"Verify Your Email"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Your account has not been verified. Please verify your email or click below to send another email
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.sendVerificationEmail} color="primary">
                      Send verification Email
                    </Button>
                    <Button onClick={this.handleEmailClose} color="primary">
                      Close
                    </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={this.state.invalidEmail}>
                <DialogTitle >{"Email Not Found"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    There is no account associated with this email.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.createAccount} color="primary">
                      Create Account
                    </Button>
                    <Button onClick={this.handleWrongLoginInfo} title="close_btn" color="primary">
                      Close
                    </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={this.state.invalidPassword}>
                <DialogTitle >{"Invalid Password"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    The password you have entered is incorrect. Please try again.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWrongLoginInfo} color="primary">
                      Close
                    </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={this.state.incorrectEmail}>
                <DialogTitle >{"Invalid Email"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You have entered an invalid email. Please check to make sure you are using a valid @wisc.edu email.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWrongLoginInfo} color="primary">
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
