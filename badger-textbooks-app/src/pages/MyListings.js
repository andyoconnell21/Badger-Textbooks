import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React from "react";

import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';

import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';


const idIndex = 0;
const dataIndex = 1;

class MyListings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listingsToDisplay: [],
            menuOpen: false,
            user: null
        }
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
            menuOpen: !curr_state
        });
    }

    componentDidMount() {
        var listIDs = [];
        var tempList = [];
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
            else {  
                firebase.firestore().collection("users").where("email", "==", user.email).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var data = doc.data();
                        listIDs = data.listings;
                        console.log(data.listings); 
                    });
                    listIDs.forEach((id) => {
                        firebase.firestore().collection("listings").doc(id.id).get().then((l) => {
                            var gather = [l.id, l.data()];
                            tempList.push(gather);

                            this.setState({
                                listingsToDisplay: tempList,
                                user: user.email
                            }); 
                        });
                    });
                });
            }
        }.bind(this));
    }

    render() {
        return (
            <div>
                <AppBar style={{ background: '#c5050c' }} position="static">
                    <Toolbar>
                        <IconButton onClick={this.toggleMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6' style={{ fontFamily: 'sans-serif', fontSize: '25px', margin: 'auto' }}>
                            {this.state.user}'s Listings
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <List>
                        <ListItem button key="home_nav" onClick={() => { window.location.href = "/home"; }}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <Divider />
                        <ListItem button key="create_listing_nav" onClick={() => { window.location.href = "/createnewlisting"; }}>
                            <ListItemIcon><AddIcon /></ListItemIcon>
                            <ListItemText primary="Create a New Listing" />
                        </ListItem>
                        <Divider />
                        <ListItem button key="saved_listings_nav" disabled>
                            <ListItemIcon><SavedIcon /></ListItemIcon>
                            <ListItemText primary="Saved Listings" />
                        </ListItem>
                        <Divider />
                        <ListItem button key="account_nav" disabled>
                            <ListItemIcon><AccountIcon /></ListItemIcon>
                            <ListItemText primary="Account" />
                        </ListItem>
                    </List>
                </Drawer>

                <Container>
                    <Card>
                        {this.state.listingsToDisplay.map((item) => (
                            <div>
                                <Grid container spacing="3" style={{ margin: "10px" }}>
                                    <Grid item xs>
                                        <img src={item[dataIndex].image_url} width="50" height="60" alt="Textbook Cover" />
                                    </Grid>
                                    <Grid item xs >
                                        Title: {item[dataIndex].title}
                                    </Grid>
                                    <Grid item xs>
                                        Author: {item[dataIndex].author}
                                    </Grid>
                                    <Grid item xs>
                                        Price: ${item[dataIndex].price}
                                    </Grid>
                                    <Grid item xs >
                                        <Button style={{ backgroundColor: '#c5050c' }} onClick={() => {
                                            sessionStorage.setItem('currentListing', item[idIndex]);
                                            console.log(sessionStorage.getItem('currentListing'));
                                            window.location.href = "/listing";
                                        }}>
                                            Details
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Divider />
                            </div>
                        ))}
                    </Card>
                </Container>
            </div>
        )
    }
}

export default MyListings