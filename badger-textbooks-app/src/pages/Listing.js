import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import ChatIcon from '@material-ui/icons/Chat';
import ReportIcon from '@material-ui/icons/Report';

class Listings extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          active: true,
          active_text: "",
          author: '',
          class: '',
          seller: '',
          seller_uid: '',
          price: '',
          date: new Date(),
          title: '',
          condition: '',
          image: '',
          ISBN: '',
          menuOpen: false,
          userAuthed: true,
          chatNotNeeded: false,
        }
    }

    componentDidMount () {
      document.body.style.backgroundColor = '#d2b48c';

      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          //User is not siged in...redirect to login page
          window.location.href = "/";
        }
      }); 
        
      var documentId = sessionStorage.getItem('currentListing')

      firebase.firestore().collection("listings").doc(documentId).get()
        .then((doc) => {
          var data = doc.data();
          console.log(data.image_url)
          if(data.image_url === "" ){
            this.setState({
              active: data.active,
              active_text: data.active ? "Active" : "Disabled",
              author: data.author,
              class: data.class,
              seller: data.seller,
              seller_uid: data.seller_uid,
              price: data.price,
              date: data.time_created,
              title: data.title,
              condition: data.condition,
              image: 'https://firebasestorage.googleapis.com/v0/b/badgertextbooks-2919f.appspot.com/o/no%20image%20available.png?alt=media&token=605d744a-ce07-470e-b9c6-406cd603319b',
              ISBN: data.ISBN
            })
          }
          else{
            this.setState({
              active: data.active,
              active_text: data.active ? "Active" : "Disabled",
              author: data.author,
              class: data.class,
              seller: data.seller,
              seller_uid: data.seller_uid,
              price: data.price,
              date: data.time_created,
              title: data.title,
              condition: data.condition,
              image: data.image_url,
              ISBN: data.ISBN
            })
        }
      })

      //check to see if its the listing of the logged in user
      var uid = ""
      var userListings = []
      firebase.auth().onAuthStateChanged((user) => {
        uid = user.uid
        firebase.firestore().collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            for(let i = 0; i < doc.data().listings.length; i++){
              userListings.push(doc.data().listings[i].id)
            }
        });
        for(var i = 0; i < userListings.length; i++){
          if(userListings[i] === sessionStorage.getItem('currentListing')){
            this.setState({
              userAuthed: false,
              chatNotNeeded: true,
            })
          }
        }
        })
      })
  }

    toggleMenu = (event) => {
      var curr_state = this.state.menuOpen;
      this.setState({
        menuOpen: !curr_state
      });
    }

    toggleActive = (event) => {
      var curr_state = this.state.active;
      if (curr_state) {
        this.setState({
          active: false,
          active_text: "Disabled"
        });
      } else {
        this.setState({
          active: true,
          active_text: "Active"
        });
      }

      var docID = sessionStorage.getItem('currentListing');

      firebase.firestore().collection('listings').doc(docID).update({
        active: !curr_state
      });
    }

    report = (event) => {
      console.log("TODO: Report the listing.");
    }

    saveListing = (event) => {
      var uid = firebase.auth().currentUser.uid;
      var documentId = sessionStorage.getItem('currentListing')
      var userRef;

      firebase.firestore().collection('listings').doc(documentId).get().then((doc) => {
        var listingRef = doc.id
        firebase.firestore().collection('users').where('uid', '==', uid).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            userRef = doc.id
          })
          firebase.firestore().collection('users').doc(userRef).update({
            saved_listings: firebase.firestore.FieldValue.arrayUnion(listingRef)
          })
        })
      })
    }
  
  render() {
   return (
      <div>
        <AppBar position = "static" style={{background:'#c5050c'}}>
          <Toolbar>
            <IconButton onClick={this.toggleMenu}> 
              <MenuIcon/>
            </IconButton>
            <Box style={{flexGrow: 1}} hidden={this.state.searchActive}>
              <Typography variant="h3">
                <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger-Textbooks
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
          <NavigationMenu/>
        </Drawer>

        <Container>
          <Paper style={{width: '100%', height: '100vh'}}>
            <Box style={{ width: '100%', height: '60%' }}>
              <Box style={{ width: '50%', height: '100%', float: 'left' }}>

                <Box name="image_box" style={{ width: '100%', height: '50%', padding: '20px'}}>
                  <img src={this.state.image} width="250" height="250" alt=""/>
                </Box>

                <Box name="button_box" style={{ width: '100%', height: '50%', padding: '20px'}}>
                  <Box hidden={this.state.userAuthed} style={{margin: '10px'}}>
                    <Grid container>
                      <Grid item style={{width: '25%'}}></Grid>
                      <Grid item style={{width: '25%'}}>
                        <Switch
                          color="primary"
                          checked={this.state.active}
                          onChange={() => this.toggleActive()}
                        />
                      </Grid>
                      <Grid item style={{width: '50%'}}>
                        <Typography variant='h5' style={{float: 'left'}}>
                          <b>Status:</b> {this.state.active_text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box hidden={this.state.userAuthed}>
                    <Button 
                      fullWidth
                      style={{
                        margin: "10px", 
                        backgroundColor: '#c5050c', 
                        width: '75%', 
                        cursor: 'pointer', 
                        color: 'white', 
                        fontSize: '18px'
                      }}
                      onClick={() => {
                          var documentId = sessionStorage.getItem('currentListing')
                          sessionStorage.setItem('currentListing',documentId);
                          window.location.href = "/editlisting";
                      }}
                      startIcon={<EditIcon/>}
                    >
                      Edit
                    </Button>
                  </Box>

                  <Box hidden={this.state.chatNotNeeded}>
                    <Button 
                      fullWidth
                      style={{
                        margin: "10px", 
                        backgroundColor: '#c5050c', 
                        width: '75%', 
                        cursor: 'pointer', 
                        color: 'white', 
                        fontSize: '18px'
                      }}
                      onClick={this.saveListing}
                      startIcon={<SaveIcon/>}
                    >
                      Save
                    </Button>
                  </Box>

                  <Box hidden={this.state.chatNotNeeded}>
                    <Button 
                      fullWidth 
                      style={{
                        marginTop: '10px',
                        marginBottom: '10px', 
                        border: '0', 
                        backgroundColor: '#c5050c', 
                        width: '75%', 
                        cursor: 'pointer', 
                        color: 'white', 
                        fontSize: '18px'}} 
                      onClick={() => {
                        sessionStorage.setItem("receiverUid", this.state.seller_uid);
                        sessionStorage.setItem("returnLocation", "/listing");
                        window.location.href = "/chat";
                      }}
                      startIcon={<ChatIcon/>}
                    >
                      Chat with Seller 
                    </Button>

                    <Box hidden={this.state.chatNotNeeded}>
                    <Button 
                      fullWidth
                      style={{
                        margin: "10px", 
                        backgroundColor: '#c5050c', 
                        width: '75%', 
                        cursor: 'pointer', 
                        color: 'white', 
                        fontSize: '18px'
                      }}
                      onClick={this.reportListing}
                      startIcon={<ReportIcon/>}
                    >
                      Report
                    </Button>
                  </Box>
                  </Box>
                </Box>
              </Box>

              <Box name="info_box" style={{ width: '50%', height: '100%', float: 'right', padding: '20px'}}>
                <Box style={{width: '100%', margin: '5px'}}>
                  <Typography variant='h5' align="left">
                    <b>Title: </b>{this.state.title}
                  </Typography>
                </Box>
                <Box style={{width: '100%', margin: '5px'}}>
                  <Typography variant='h5' align="left">
                    <b>Author: </b>{this.state.author}
                  </Typography>
                </Box>
                <Box style={{width: '100%', margin: '5px'}}>
                  <Typography variant='h5' align="left">
                    <b>Class: </b>{this.state.class}
                  </Typography>
                </Box>
                <Box style={{width: '100%', margin: '5px'}}>
                  <Typography variant='h5' align="left">
                    <b>Condition: </b>{this.state.condition}
                  </Typography>
                </Box>
                <Box style={{width: '100%', margin: '5px'}}>
                  <Typography variant='h5' align="left">
                    <b>Price: </b>${this.state.price}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box name="more_info_box" style={{ width: '100%', height: '40%' }}>
              <Accordion style={{width: "75%", margin: 'auto'}}>
                <AccordionSummary style={{backgroundColor: 'lightgrey'}} expandIcon={<ExpandIcon />}>
                  <Typography style={{fontFamily: 'sans-serif', fontSize:'14px', fontWeight: 'bold', margin:'auto'}}>MORE INFORMATION</Typography>
                </AccordionSummary>
                <AccordionDetails style={{flexDirection: 'column'}}>
                  <Typography>
                    <b>Seller:</b> 
                    <Link to="/userAccount" title='sellerAccount' style={{cursor: 'pointer'}} onClick={() => {
                          window.location.href = "/userAccount"
                          sessionStorage.setItem('userAccountEmail', this.state.seller)
                      }} 
                      variant="body2"> {this.state.seller}</Link>
                  </Typography>
                  <Typography>
                    <b>ISBN: </b> {this.state.ISBN}
                  </Typography>
                  <Typography>
                    <b>Listing Date:</b> {this.state.date.toString()}
                  </Typography>
                  <Typography>
                    <b>Seller Rating:</b> 5 Star
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Paper>
        </Container>
      </div>
    )
  }
}

export default Listings;
