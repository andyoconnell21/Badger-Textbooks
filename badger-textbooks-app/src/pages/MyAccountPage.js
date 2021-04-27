import firebase from 'firebase/app';
import 'firebase/firestore';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import {
  Container,
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import AcceptIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import LogoutIcon from '@material-ui/icons/ExitToApp';

const backgroundGrey = '#dadfe1';
const badgerRed = '#c5050c';

class MyAccountPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      name: '',
      email: '',
      password: '',
      profilePic: '',
      rating: 0,

      nameInput: '',
      passwordInput: '',
      conPasswordInput: '',

      editButtonVis: '',
      accanButtonVis: 'none',
      docID: '',
      menuOpen: false,
      passwordsMismatch: false,
      badPassword: false
    };

    //this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount () {
    document.body.style.backgroundColor = backgroundGrey;


    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        //User is not siged in...redirect to login page
        window.location.href = "/";
      } else {
        this.setState({ uid: user.uid });

        firebase.firestore().collection('users').where("uid", "==", user.uid).get()
        .then((doc) => {
          doc.forEach((i) => {
            var data = i.data();
            var total_rating = 0;
            data.user_ratings.forEach((r) => {
              total_rating += r;
            });
            var ave_rating = total_rating / data.user_ratings.length;
            ave_rating = ave_rating.toFixed(1);
            this.setState({
              docID: i.id,
              email: data.email,
              name: data.name,
              password: data.password,
              profilePic: "https://firebasestorage.googleapis.com/v0/b/badgertextbooks-2919f.appspot.com/o/userAccountImage.png?alt=media&token=91c14802-542d-4723-8c55-405b7552c8fa",
              rating: ave_rating,
              
              nameInput: data.name,
            });
          })
        })
      }
    }.bind(this));
  }

  addDefaultSrc(ev) {
    ev.target.src = "https://firebasestorage.googleapis.com/v0/b/badgertextbooks-2919f.appspot.com/o/userAccountImage.png?alt=media&token=91c14802-542d-4723-8c55-405b7552c8fa"
  }

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      //Sign-out successful.
      window.location.href = '/'
    }).catch((error) => {
      //An error happened.
    });
  }

  handleNameChange = (event) => { 
    this.setState({nameInput: event.target.value}); 
  }

  handlePasswordChange = (event) => { 
    this.setState({passwordInput: event.target.value}); 
  }

  handleConPasswordChange = (event) => { 
    this.setState({conPasswordInput: event.target.value}); 
  }

  toggleMenu = (event) => {
    var curr_state = this.state.menuOpen;
    this.setState({
      menuOpen: !curr_state
    });
  }

  handleClose = (event) => {
    this.setState({
      passwordsMismatch: false,
      badPassword: false,
      passwordInput: "",
      conPasswordInput: ""
    });
}

  handleEditClick() {
    this.setState({
      editButtonVis: 'none',
      accanButtonVis: ''
    })
  }

  handleCancelClick() {
    this.setState({
      nameInput: this.state.name,
      editButtonVis: '',
      accanButtonVis: 'none'
    });
  }

  handleAcceptClick() {
    if (this.state.passwordInput === this.state.conPasswordInput) {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(user.email, this.state.password);
      user.reauthenticateWithCredential(cred).then(() => {
        user.updatePassword(this.state.passwordInput).then(() => {
          //success
          firebase.firestore().collection('users').doc(this.state.docID).update({
            name: this.state.nameInput !== '' ? this.state.nameInput : this.state.name,
            password: this.state.passwordInput !== '' ? this.state.passwordInput : this.state.password,
          }).then(() =>
              this.setState({
                name: this.state.nameInput,
                password: this.state.passwordInput,
                passwordInput: '',
                conPasswordInput: '',
                editButtonVis: '',
                accanButtonVis: 'none'
              })
          );
        }, (error) => {
          this.setState({ badPassword: true })
        });
      });
    } else {
      this.setState({ passwordsMismatch: true });
    }
  }

  handleImageChange = (event) => {
    //Adds image to storage
    const file = event.target.files[0]
    var storage = firebase.storage()
    var storageRef = storage.ref()
    const fileRef = storageRef.child(file.name)
    fileRef.put(file).then(() => {
      //Saved image file path
      storageRef.child(file.name).getDownloadURL().then((url) => {
        this.setState({imageURL: url})
      })
    })
  }

  render () {
    return (
        <div>
          <AppBar style={{ background: badgerRed }} position="static">
              <Toolbar>
                  <IconButton title="menu_btn" onClick={this.toggleMenu} style={{ zIndex: 1, marginTop: '15px', marginBottom: '15px' }}>
                      <MenuIcon />
                  </IconButton>
                  <Typography style={{position: 'absolute', fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', left: 0, right: 0}}>
                      <img onError={this.addDefaultSrc} src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger Textbooks
                  </Typography>
                  <Typography style={{flexGrow: 1}}></Typography>
                  <IconButton onClick={this.handleLogout} style={{float: 'right'}}>
                    <LogoutIcon/>
                  </IconButton>
              </Toolbar>
          </AppBar>

          <Drawer title="nav_menu" anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
            <NavigationMenu/>
          </Drawer>

          <Container>
            <Paper variant="outlined" square style={{height: "100vh", padding: "20px"}}>

              <img onError={this.addDefaultSrc} className="img-responsive"
                src={this.state.profilePic} width="150" height="150" alt="" style={{backgroundColor: "#ffffff"}}/>

              <Box style={{marginTop: "20px", marginBottom: '20px'}}>
                <Rating name="read-only" value={this.state.rating} readOnly />
                <Typography>
                    ({this.state.rating}/5)
                </Typography>
              </Box>
              
              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item xs>
                  <Typography style={{float: 'right'}}>
                    Name:
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.editButtonVis}}>
                  <Typography style={{float: 'left'}}>
                    {this.state.name}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.accanButtonVis}}>
                  <TextField
                      title="nameChange"
                      data-testid='nameChange'
                      fullWidth
                      variant="outlined"
                      value={this.state.nameInput}
                      onChange={this.handleNameChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item xs>
                  <Typography style={{float: 'right'}}>
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.editButtonVis}}>
                  <Typography style={{float: 'left'}}>
                    {this.state.email}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.accanButtonVis}}>
                  <Typography align="left" style={{color: '#888888', float: 'left'}}>
                    {this.state.email}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item xs>
                  <Typography style={{float: 'right'}}>
                    Password:
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.editButtonVis}}>
                  <Typography style={{float: 'left'}}>
                    {this.state.password}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.accanButtonVis}}>
                  <TextField
                      title="passwordChange"
                      data-testid='passwordChange'
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={this.state.passwordInput}
                      onChange={this.handlePasswordChange}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} style={{marginBottom: '10px', display: this.state.accanButtonVis}}>
                <Grid item xs>
                  <Typography style={{float: 'right'}}>
                    Confirm Password:
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.accanButtonVis}}>
                  <TextField
                      title="passwordChangeConfirm"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={this.state.conPasswordInput}
                      onChange={this.handleConPasswordChange}
                  />
                </Grid>
              </Grid>
            
            <Button
                title="edit_btn"
                style={{display: this.state.editButtonVis}}
                variant='contained'
                onClick={() => this.handleEditClick()}
            >
              <EditIcon/>
              <Typography>
                Edit My Information
              </Typography>
            </Button>

            <Grid container spacing={1} style={{display: this.state.accanButtonVis}}>
              <Grid item xs>
                <Button
                    variant='contained'
                    onClick={() => this.handleCancelClick()}
                    style={{float: 'right'}}
                >
                  <CancelIcon/>
                  <Typography>
                    Cancel
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                    variant='contained'
                    onClick={() => this.handleAcceptClick()}
                    style={{float: 'left'}}
                >
                  <AcceptIcon/>
                  <Typography>
                    Confirm
                  </Typography>
                </Button>
              </Grid>
            </Grid>

            </Paper>
          </Container>

          <Dialog open={this.state.passwordsMismatch}>
            <DialogTitle >{"Uh-Oh!"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    The passwords you entered do not match. Please try again.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button title='close_btn' onClick={this.handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog open={this.state.badPassword}>
            <DialogTitle >{"Uh-Oh!"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    The password you entered is too short. Make sure that it is at least 6 characters!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button title='close_btn' onClick={this.handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default MyAccountPage;
