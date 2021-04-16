import firebase from 'firebase/app';
import 'firebase/firestore';

import NavigationMenu from './NavigationMenu';

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
import Drawer from '@material-ui/core/Drawer';

import MenuIcon from '@material-ui/icons/Menu';

class MyAccountPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      phone: '',
      email: '',
      uid: '',


      description: '',
      mood: '',
      address: '',
      nameInput: '',
      passwordInput: '',
      emailInput: '',
      phoneInput: '',
      descriptionInput: '',
      moodInput: '',
      imageURL: '',
      editVis: '',
      acceptVis: 'none',
      cancelVis: 'none',
      docID: ''
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleMoodChange = this.handleMoodChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    // this.handleAddressChange = this.handleAddressChange.bind(this);
    //this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount () {
    document.body.style.backgroundColor = '#494949'

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
            this.setState({
              name: data.name,
              password: data.password,
              menuOpen: false,
              email: data.email,
              phone: data.phone,
              docID: i.id
              // username: data.username,
              // password: data.password,
              // description: data.description,
              // mood: data.mood,
              // address: data.address,
              // usernameInput: data.username,
              // passwordInput: data.password,
              // descriptionInput: data.description,
              // moodInput: data.mood,
              // addressInput: data.address,
              // imageURL: data.imageURL
            });
          })
        })
      }
    }.bind(this));

    
  }

//   handleLogout () {
//     firebase.auth().signOut().then(() => {
//       //Sign-out successful.
//     }).catch((error) => {
//       //An error happened.
//     });
//     window.location.href = '/'
//   }

handleNameChange(event) { this.setState({nameInput: event.target.value}); }
handlePasswordChange(event) { this.setState({passwordInput: event.target.value}); }
handleDescriptionChange(event) { this.setState({descriptionInput: event.target.value}); }
handleMoodChange(event) { this.setState({moodInput: event.target.value}); }
handlePhoneChange(event) { this.setState({phoneInput: event.target.value});}


toggleMenu = (event) => {
  var curr_state = this.state.menuOpen;
  this.setState({
    menuOpen: !curr_state
  });
} 

handleEditClick() {
    this.setState({
      editVis: 'none',
      acceptVis: 'inline',
      cancelVis: 'inline'
    })
  }

  handleCancelClick() {
    this.setState({
      nameInput: this.state.name,
      passwordInput: this.state.password,
      phoneInput: this.state.phone,
      descriptionInput: this.state.description,
      moodInput: this.state.mood,
      imageURL: this.state.imageURL,
    //   addressInput: this.state.address,
      editVis: '',
      acceptVis: 'none',
      cancelVis: 'none'
    });
  }

  handleAcceptClick() {

    var status = localStorage.getItem('userStatus');

    firebase.firestore().collection('users').doc(this.state.docID).update({
      name: this.state.nameInput != '' ? this.state.nameInput : this.state.name,
      password: this.state.passwordInput != '' ? this.state.passwordInput : this.state.password,
      email: this.state.email,
      phone: this.state.phoneInput != '' ? this.state.phoneInput : this.state.phone,
      // description: this.state.descriptionInput,
      // mood: this.state.moodInput,
      imageURL: this.state.imageURL,
    }).then(() => 
      firebase.firestore().collection('users').doc(this.state.docID).get()
      .then((doc) => {
        var data = doc.data();
        this.setState({
          name: data.name,
          password: data.password,
          email: data.email,
          phone: data.phone,
          //description: data.description,
          //mood: data.mood,
          //imageURL: data.imageURL,
          nameInput: '',
          passwordInput: '',
          phoneInput: '',
          //descriptionInput: '',
          //moodInput: data.mood,

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
   
  //change for line 269: {this.displayPayment()}
  render () {
    return (
      <div>
          <AppBar position="static" style={{ background: '#c5050c' }}>
            <Toolbar>

              <IconButton title="menu_btn" onClick={this.toggleMenu}> 
                <MenuIcon/>
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

          <Drawer title="nav_menu" anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
            <NavigationMenu/>
          </Drawer>

          {/* <Typography variant='subtitle1' style={{color: '#ffffff', marginTop: '10px'}}>
            Email: {localStorage.getItem('email')}
          </Typography> */}
          
          {/* <Typography variant='subtitle1' style={{color: '#ffffff', marginTop: '10px'}}>
            Account Type: {this.state.type}
          </Typography> */}

          <Card style={{margin: '10px'}}>
            <Box style={{margin: '15px'}}>
              <Typography variant='subtitle1' alignment='center' style={{color: '#ffffff', marginTop: '10px'}}>
                
              </Typography>
              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                    Name: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.name}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <TextField
                    title="nameChange"
                    inputProps={{"data-testid": "nameChange"}}
                    fullWidth
                    value={this.state.nameInput}
                    onChange={this.handleNameChange}
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
                    title="passwordChange"
                    inputProps={{"data-testid": "passwordChange"}}
                    fullWidth
                    value={this.state.passwordInput}
                    onChange={this.handlePasswordChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                    Email:
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.email}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <Typography align="left">
                    Email must remain the same
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} style={{marginBottom: '10px'}}>
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
                    title="phoneChange"
                    inputProps={{"data-testid": "phoneChange"}}
                    fullWidth
                    value={this.state.phoneInput}
                    onChange={this.handlePhoneChange}
                  />
                </Grid>
              </Grid>

              {/* <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                  Description: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    {this.state.Description}
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <TextField
                    fullWidth
                    value={this.state.descriptionInput}
                    onChange={this.handleDescriptionChange}
                  />
                </Grid>
              </Grid> */}

              {/* <Grid container spacing={1} style={{marginBottom: '10px'}}>
                <Grid item>
                  <Typography>
                  Mood: 
                  </Typography>
                </Grid>
                <Grid item style={{display: this.state.editVis}}>
                  <Typography>
                    
                  </Typography>
                </Grid>
                <Grid item xs style={{display: this.state.acceptVis}}>
                  <Select
                    fullWidth
                    onChange={this.handleMoodChange}
                    value={this.state.moodInput}
                    style={{textAlign: 'left'}}
                  >
                    <MenuItem value={1}>I feel good</MenuItem>
                    <MenuItem value={2}>Bad Mood Today</MenuItem>
                    <MenuItem value={3}>Just SoSo</MenuItem>
                  </Select>
                </Grid>
              </Grid> */}

              {/* <div>
                        <label>My Profile Photo: </label>
                        <input className="w3-input w3-hover-light-gray"
                            type='file'
                            onChange={this.handleImageChange}
                        />
                    </div> */}

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

            <IconButton
              style={{display: this.state.editVis, margin: '20px'}}
              variant='contained'
              starticon={<EditIcon/>}
              title="update_btn"
              onClick={() => this.handleEditClick()}
            >
              Update My Info
            </IconButton>
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
