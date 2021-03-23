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

class CreateAccount extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            hidden: false
        }
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

    handleOpen = (event) => {
        this.setState({hidden:true})
    }

    backToLogin = (event) => {
        window.location.href = '/'
    }

    createAccount = (event) => {
        event.preventDefault();

        //Create the user account with email and password
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                var user = userCredential.user
                //Create alert for this
                this.setState({hidden: true})
            })
            .catch((error) => {
                //error
            })
        
        //Create a new user account and set the given data
        var fullName = this.state.firstName.concat(" ", this.state.lastName)
        firebase.firestore().collection('users').doc().set({
            email: this.state.email,
            password: this.state.password,
            name: fullName
        })          
    }   

    loginPage = (event) => {
        window.location.href = '/'
    }

    render(){
        return(
            <div>
                <AppBar position = "static" style={{background:'#c5050c'}}>
                    <Typography variant='h6' style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '25px', margin: '25px', textAlign: 'center'}}>
                        Welcome to Badger Textbooks
                    </Typography>
                </AppBar>

                <Container component="main" maxWidth="xs" style={{marginTop: '40px', fontFamily: 'sans-serif'}}>
                    <Typography component="h1" variant="h4" style={{textAlign: 'center'}}>
                        Create An Account
                    </Typography>
                    <form onSubmit={this.createAccount}>
                        <TextField
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
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="last name"
                            label="Last Name"
                            name="last name"
                            type="text"
                            onChange = {this.setLastName}
                            autoFocus
                            />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
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
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            onChange = {this.setPassword}
                            autoFocus
                            />
                        <Button type="submit" style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '50%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Create Account</Button>
                        <Grid item xs>
                            <Link href="#" onClick={this.loginPage} variant="body2">
                            Back to Login Page
                            </Link>
                        </Grid>
                    </form>
                    <Dialog open={this.state.hidden}>
                        <DialogTitle >{"Account Created"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Return to the login page to login to your account
                            </DialogContentText>                        
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.backToLogin} color="primary">
                            Back to Login
                        </Button>
                        </DialogActions>
                    </Dialog>
                </Container>          
            </div>
        )
    }
}

export default CreateAccount  
