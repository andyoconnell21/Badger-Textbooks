import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Logo from '../BadgerTextbooksLogoV1.png';

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
    DialogContentText,
} from "@material-ui/core";

class CreateAccount extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            hidden: false,
            createAccountError: false,
            invalidEmail: false,
            invalidPassword: false,
        };
        this.setErrorHandler = this.setErrorHandler.bind(this)
    }

    setErrorHandler(){
        this.setState({createAccountError: true})
    }

    setFirstName = (event) => {
        this.setState({firstName: event.target.value})
    }

    setLastName = (event) => {
        this.setState({lastName: event.target.value})
    }

    setEmail = (event) => {
        this.setState({email: event.target.value})
    }

    setPassword = (event) => {
        this.setState({password: event.target.value})
    }

    backToLogin = (event) => {
        window.location.assign('/');
    }

    createAccount = (event) => {
        event.preventDefault();

        var splitEmail = this.state.email.split("@")
        if(splitEmail[1] !== 'wisc.edu'){
            this.setState({invalidEmail: true})
        }
        else if (this.state.password.length < 6) {
            this.setState({invalidPassword: true})
        }
        else{
            //Create the user account with email and password
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((userCredential) => {
                    //var user = userCredential.user
                    //Create alert for this
                    this.setState({hidden: true})
                    this.setState({createAccountError: false})

                    //Send verification email to user
                    var user = firebase.auth().currentUser;
                    user.sendEmailVerification().then(function() {
                        //Email sent.
                    }).catch(function(error) {
                        //An error happened.
                    });

                    //Create a new user account and set the given data
                    var fullName = this.state.firstName.concat(" ", this.state.lastName)
                    firebase.firestore().collection('users').add({
                        email: this.state.email,
                        password: this.state.password,
                        name: fullName,
                        address: "",
                        phone: 0,
                        listings: [],
                        saved_listings: [],
                        uid: user.uid,
                        isAdmin: false,
                        user_ratings: []
                    })
                })
                .catch((error) => {
                    //Implement alert using an email that already exists
                    //Take error code and if an error occurs, update accordingly
                    this.setErrorHandler(true)
                });
        }
    }

    closeInvalidEmail = (event) => {
        this.setState({invalidEmail: false})
    }

    closeInvalidPassword = (event) => {
        this.setState({invalidPassword: false})
    }

    render(){
        return(
            <div>
                <AppBar position = "static" style={{background:'#c5050c'}}>
                    <Typography style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', textAlign: 'center'}}>
                        <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Welcome to Badger Textbooks
                    </Typography>
                </AppBar>

                <Container component="main" maxWidth="xs" style={{marginTop: '40px', fontFamily: 'sans-serif'}}>
                    <Typography component="h1" variant="h4" style={{textAlign: 'center'}}>
                        Create an Account
                    </Typography>
                    <form onSubmit={this.createAccount}>
                        <TextField
                            title='firstNameInput'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="first name"
                            label="First Name"
                            name="first name"
                            type="text"
                            onChange = {this.setFirstName}
                            autoFocus
                        />
                        <TextField
                            title='lastNameInput'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="last name"
                            label="Last Name"
                            name="last name"
                            type="text"
                            onChange = {this.setLastName}
                        />
                        <TextField
                            title='emailInput'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            onChange = {this.setEmail}
                            // error = {this.state.createAccountError}
                            // helperText = "Email is already in use"
                        />
                        <TextField
                            title='passwordInput'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            onChange = {this.setPassword}
                        />
                        <Button type="submit" title="submit_btn" style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '50%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Create Account</Button>
                        <Grid item xs>
                            <Link href="#" title='backToLogin' onClick={this.backToLogin} variant="body2">
                                Back to Login Page
                            </Link>
                        </Grid>
                    </form>
                    <Dialog open={this.state.hidden}>
                        <DialogTitle >{"Account Created"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                A verification email has been sent to you.
                            </DialogContentText>
                            <DialogContentText>
                                Return to the login page to login to your account.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.backToLogin} color="primary">
                                Back to Login
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={this.state.invalidEmail}>
                        <DialogTitle >{"Invalid Email"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Not a valid email. Your email must be a @wisc.edu email account.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button title="close_email" onClick={this.closeInvalidEmail} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={this.state.invalidPassword}>
                        <DialogTitle >{"Invalid Password"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Password must contain at least 6 characters.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button title="close_password" onClick={this.closeInvalidPassword} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </div>
        )
    }
}

export default CreateAccount;