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

class CreateAccount extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
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

    createAccount = (event) => {
        event.preventDefault();
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
                </Container>          
            </div>
        )
    }
}

export default CreateAccount  
