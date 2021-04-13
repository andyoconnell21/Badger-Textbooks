import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import MenuIcon from '@material-ui/icons/Menu';
import StarBorderIcon from '@material-ui/icons/StarBorder';

class Listings extends React.Component {
    constructor(props){
        super(props)
        this.state = {
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
      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          //User is not siged in...redirect to login page
          window.location.href = "/";
        }
      }); 
        
      var documentId = sessionStorage.getItem('currentListing')
      document.body.style.backgroundColor = '#dadfe1';

      firebase.firestore().collection("listings").doc(documentId).get()
        .then((doc) => {
          var data = doc.data();
          console.log(data.image_url)
          if(data.image_url === "" ){
            console.log('true')
            this.setState({
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

    saveListing = (event) => {
      var uid = firebase.auth().currentUser.uid;
      var user_email = firebase.auth().currentUser.email;
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
            <Typography variant='h6' style={{fontFamily: 'sans-serif', fontSize: '25px', margin: 'auto'}}>
              Listing of {this.state.title} Textbook
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
          <NavigationMenu/>
        </Drawer>

        <Grid container>
          <Card style={{width: "600px", margin:'auto', marginTop: '50px'}}>
            <CardContent>
              <Grid container>
                <Grid item>
                  <img src={this.state.image} width="250" height="250" alt="Textbook Cover"/>
                </Grid>
                <Grid item xs style={{marginTop:'40px'}}>
                  <Typography variant='h6'>
                    <b>Title:</b> {this.state.title}
                  </Typography>
                  <Typography variant='h6'>
                    <b>Author:</b> {this.state.author}
                  </Typography>
                  <Typography variant='h6'>
                    <b>Class:</b> {this.state.class}
                  </Typography>
                  <Typography variant='h6'>
                    <b>Condition:</b> {this.state.condition}
                  </Typography>
                  <Typography variant='h6'>
                    <b>Price:</b> {this.state.price}$
                  </Typography>
                </Grid>
              </Grid>
              <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
              <Accordion style={{width: "75%", margin: 'auto'}}>
                <AccordionSummary style={{backgroundColor: 'lightgrey'}}>
                  <Typography style={{fontFamily: 'sans-serif', fontSize:'14px', fontWeight: 'bold', margin:'auto'}}>MORE INFORMATION</Typography>
                </AccordionSummary>
                <AccordionDetails style={{flexDirection: 'column'}}>
                  <Typography>
                    <b>Seller of Textbook:</b> {this.state.seller}
                  </Typography>
                  <Typography>
                    <b>ISBN: </b> {this.state.ISBN}
                  </Typography>
                  <Typography>
                    <b>Date of Listing:</b> {this.state.date.toString()}
                  </Typography>
                  <Typography>
                    <b>Rating of Seller:</b> 5 Star
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Grid hidden={this.state.userAuthed}>
                <Button 
                    fullWidth
                    style={{
                      marginTop: "10px", 
                      marginBottom: '10px', 
                      border: '0', 
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
                    }}>
                    Edit Listing
                </Button>
              </Grid>

              <Button 
                  fullWidth
                  style={{
                    marginTop: "10px", 
                    marginBottom: '10px', 
                    border: '0', 
                    backgroundColor: '#c5050c', 
                    width: '75%', 
                    cursor: 'pointer', 
                    color: 'white', 
                    fontSize: '18px'
                  }}
                  onClick={this.saveListing}>
                  Save Listing
              </Button>

              <Grid hidden={this.state.chatNotNeeded}>
                <Button 
                  fullWidth 
                  style={{
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
                    }}>
                    Chat with Seller! 
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </div>
     )
  }
}

export default Listings

