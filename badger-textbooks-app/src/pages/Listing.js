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
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

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

    deleteStorage = (id) => {
        firebase
            .firestore()
            .collection("listing")
            .doc(id)
            .delete()
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
            menuOpen: !curr_state
        });
    }

    addDefaultSrc(ev) {
        ev.target.src = "https://badgerchemistnews.chem.wisc.edu/wp-content/themes/uw-theme/dist/images/bucky-head.png"
    }

    render() {
        return (
            <div>
                <AppBar position="static" style={{background: '#c5050c'}}>
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
                        <ListItem button key="home_nav" onClick={() => {
                            window.location.href = "/home";
                        }}>
                            <ListItemIcon><HomeIcon/></ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                        <Divider/>
                        <ListItem button key="create_listing_nav" onClick={() => {
                            window.location.href = "/createnewlisting";
                        }}>
                            <ListItemIcon><AddIcon/></ListItemIcon>
                            <ListItemText primary="Create a New Listing"/>
                        </ListItem>
                        <Divider/>
                        <ListItem button key="my_listings_nav" onClick={() => {
                            window.location.href = "/mylistings";
                        }}>
                            <ListItemIcon><MyListingsIcon/></ListItemIcon>
                            <ListItemText primary="My Listings"/>
              </ListItem>
              <Divider/>
              <ListItem button key="chat_list_nav" onClick={() => {window.location.href = "/chatlistpage";}}>
                <ListItemIcon><ChatIcon/></ListItemIcon>
                <ListItemText primary="My Conversations" />
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

        <Grid container>
          <Card style={{width: "600px", margin:'auto', marginTop: '50px'}}>
              <CardContent>
                  <Grid container>
                      <Grid item>
                          {/*<img src={this.state.image} width="250" height="250" alt="Textbook Cover"/>*/}
                          <img align='right' width="500" height="600"
                               style={{border: "5px solid black", padding: '15px'}}
                               onError={this.addDefaultSrc} className="img-responsive"
                               src={this.state.image} alt="Textbook Cover"/>
                      </Grid>
                      <Grid item xs>
                          <Typography style={{align: "left"}} variant='h6'>
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
                          <Typography
                              style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'bold', margin: 'auto'}}>MORE
                              INFORMATION</Typography>
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
                  fontSize: '18px'}} 
                  onClick={() => {
                    sessionStorage.setItem("receiverEmail", this.state.owner);
                    sessionStorage.setItem("returnLocation", "/listing");
                    window.location.href = "/testChatPage";
                  }}>
                  Chat with Seller! 
                </Button>
            </CardContent>
          </Card>
        </Grid>
      </div>
     )
  }


}

export default Listings

