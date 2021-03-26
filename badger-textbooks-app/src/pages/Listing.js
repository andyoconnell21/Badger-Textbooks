import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';


class Listings extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          author: '',
          class: '',
          owner: '',
          price: '',
          date: new Date(),
          title: '',
          condition: '',
          image: '',
          ISBN: '',
          menuOpen: false
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
          this.setState({
            author: data.author,
            class: data.class,
            owner: data.owner,
            price: data.price,
            date: data.time_created,
            title: data.title,
            condition: data.condition,
            image: data.image_url,
            ISBN: data.ISBN
          })
        })
    }

    //Implement message system
    contactSeller = (event) => {
      
    }

    toggleMenu = (event) => {
      var curr_state = this.state.menuOpen;
      this.setState({
        menuOpen: !curr_state
      });
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
          <List>
              <ListItem button key="home_nav" onClick={() => {window.location.href = "/home";}}>
                <ListItemIcon><HomeIcon/></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <Divider/>
              <ListItem button key="create_listing_nav" onClick={() => {window.location.href = "/createnewlisting";}}>
                <ListItemIcon><AddIcon/></ListItemIcon>
                <ListItemText primary="Create a New Listing" />
              </ListItem>
              <Divider/>
              <ListItem button key="my_listings_nav" onClick={() => {window.location.href = "/mylistings";}}>
                <ListItemIcon><MyListingsIcon/></ListItemIcon>
                <ListItemText primary="My Listings" />
              </ListItem>
              <Divider/>
              <ListItem button key="saved_listings_nav" disabled>
                <ListItemIcon><SavedIcon/></ListItemIcon>
                <ListItemText primary="Saved Listings" />
              </ListItem>
              <Divider/>
              <ListItem button key="account_nav" disabled>
                <ListItemIcon><AccountIcon/></ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
          </List>
        </Drawer>

        <h2>Title: {this.state.title}</h2>
        <h3>Author: {this.state.author}</h3>
        <h3>Class: {this.state.class}</h3>
        <h3>Condition: {this.state.condition}</h3>
        <h3>Price: ${this.state.price}</h3>
        <img src={this.state.image} alt="textbook" style={{marginBottom: "15px", width:'20%'}}/>
        <Accordion style={{width: "25%", margin: 'auto'}}>
          <AccordionSummary style={{backgroundColor: 'lightgrey'}}>
            <Typography style={{fontFamily: 'sans-serif', fontSize:'14px', fontWeight: 'bold', margin:'auto'}}>MORE INFORMATION</Typography>
          </AccordionSummary>
          <AccordionDetails style={{flexDirection: 'column'}}>
            <Typography>
              <b>Seller of Textbook:</b> {this.state.owner}
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
        <Button onClick={this.contactSeller} style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '25%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Contact Seller</Button>
      </div>
     )
  }
}

export default Listings

