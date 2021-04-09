import firebase from 'firebase/app';
import 'firebase/firestore';

import React from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AcceptIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class MyAccountPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: '',
      username: '',
      password: '',
      description: '',
      phone: '',
      address: '',
      usernameInput: '',
      passwordInput: '',
      descriptionInput: '',
    //   phoneInput: '',
    //   addressInput: '',
      editVis: '',
      acceptVis: 'none',
      cancelVis: 'none'
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    // this.handlePhoneChange = this.handlePhoneChange.bind(this);
    // this.handleAddressChange = this.handleAddressChange.bind(this);
    //this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount () {

    document.body.style.backgroundColor = '#494949'

    firebase.auth().signInWithEmailAndPassword(localStorage.getItem('email'), localStorage.getItem('password'))
      .then((userCredential) => {
        //signed in!
      })
      .catch((error) => {
        console.log(error.code)
      });

    var status = localStorage.getItem('userStatus');
    var docID = "customer"

    firebase.firestore().collection('users').doc(docID).get()
    .then((doc) => {
        var data = doc.data();
        this.setState({
          type: data.type,
          username: data.username,
          password: data.password,
          description: data.description,
        //   phone: data.phone,
        //   address: data.address,
          usernameInput: data.username,
          passwordInput: data.password,
          descriptionInput: data.description,
          phoneInput: data.phone,
          addressInput: data.address,
        });
      })
  }

//   handleLogout () {
//     firebase.auth().signOut().then(() => {
//       //Sign-out successful.
//     }).catch((error) => {
//       //An error happened.
//     });
//     window.location.href = '/'
//   }

  handleUsernameChange(event) { this.setState({usernameInput: event.target.value}); }
  handlePasswordChange(event) { this.setState({passwordInput: event.target.value}); }
  handleDescriptionChange(event) { this.setState({descriptionInput: event.target.value}); }
//   handlePhoneChange(event) { this.setState({phoneInput: event.target.value}); }
//   handleAddressChange(event) { this.setState({addressInput: event.target.value}); }

 handleEditClick() {
    this.setState({
      editVis: 'none',
      acceptVis: 'inline',
      cancelVis: 'inline'
    })
  }

  handleCancelClick() {
    this.setState({
      usernameInput: this.state.username,
      passwordInput: this.state.password,
      descriptionInput: this.state.description,
    //   phoneInput: this.state.phone,
    //   addressInput: this.state.address,
      editVis: '',
      acceptVis: 'none',
      cancelVis: 'none'
    })
  }

  handleAcceptClick() {

    var status = localStorage.getItem('userStatus');
    var docID = "customer"

    firebase.firestore().collection("users").doc(docID).update({
      username: this.state.usernameInput,
      password: this.state.passwordInput,
      description: this.state.descriptionInput,
    //   phone: this.state.phoneInput,
    //   address: this.state.addressInput
    }).then(() => 
      firebase.firestore().collection('users').doc(docID).get()
      .then((doc) => {
        var data = doc.data();
        this.setState({
          username: data.username,
          password: data.password,
          description: data.description,
        //   phone: data.phone,
        //   address: data.address,
          usernameInput: data.username,
          passwordInput: data.password,
          descriptionInput: data.description,
        //   phoneInput: data.phone,
        //   addressInput: data.address,
          editVis: '',
          acceptVis: 'none',
          cancelVis: 'none'
        })
      })
    );

    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(localStorage.getItem('email'), this.state.password);
    user.reauthenticateWithCredential(cred);

    user.updatePassword(this.state.passwordInput).then(() => {
      //success
    }, (error) => {
        console.log(error.code)
    });
  }
   
  //change for line 269: {this.displayPayment()}
  render () {
    return (
      <div>
          <AppBar position="static" style={{ background: '#c5050c' }}>
            <Toolbar>
              <IconButton onClick={event =>  window.location.href='/home'}>
                <BackIcon/>
              </IconButton>
              <Typography variant='h6' style={{flexGrow: 1}}>
                My Account
              </Typography>
              <IconButton
                onClick={this.handleLogout}
              >
                <LogoutIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>

          <Typography variant='subtitle1' style={{color: '#ffffff', marginTop: '10px'}}>
            Email: {localStorage.getItem('email')}
          </Typography>
          
          <Typography variant='subtitle1' style={{color: '#ffffff', marginTop: '10px'}}>
            Account Type: {this.state.type}
          </Typography>

          <Card style={{margin: '10px'}}>
            <Box style={{margin: '15px'}}>
              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                    Username: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.username}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <TextField
                    fullWidth
                    value={this.state.usernameInput}
                    onChange={this.handleUsernameChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                    Password: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.password}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <TextField
                    fullWidth
                    value={this.state.passwordInput}
                    onChange={this.handlePasswordChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                  Description: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <Select
                    fullWidth
                    onChange={this.handleDescriptionChange}
                    value={this.state.descriptionInput}
                    style={{textAlign: 'left'}}
                  >
                    <MenuItem value={1}>I feel good</MenuItem>
                    <MenuItem value={2}>Bad Mood Today</MenuItem>
                    <MenuItem value={3}>Just SoSo</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              {/* <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                    Phone: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.phone}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <TextField
                    fullWidth
                    type='number'
                    value={this.state.phoneInput}
                    onChange={this.handlePhoneChange}
                  />
                </Grid>
              </Grid> */}

              {/* <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                    Address: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.address}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <TextField
                    fullWidth
                    value={this.state.addressInput}
                    onChange={this.handleAddressChange}
                  />
                </Grid>
              </Grid> */}
            </Box>

            <Container>
              <Divider/>
            </Container>

            <Button
              style={{display: this.state.editVis, margin: '20px'}}
              variant='contained'
              startIcon={<EditIcon/>}
              onClick={() => this.handleEditClick()}
            >
              Update My Info
            </Button>
            <Button
              style={{display: this.state.cancelVis, margin: '20px'}}
              variant='contained'
              onClick={() => this.handleCancelClick()}
            >
              <CancelIcon/>
              <Typography>
                Cancel
              </Typography>
            </Button>
            <Button
              style={{display: this.state.acceptVis, margin: '20px'}}
              variant='contained'
              onClick={() => this.handleAcceptClick()}
            >
              <AcceptIcon/>
              <Typography>
                Confirm
              </Typography>
            </Button>
          </Card>
      </div>
    );
  }
}

export default MyAccountPage;
