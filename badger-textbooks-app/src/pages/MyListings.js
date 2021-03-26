/*Create MyListings UI
 1. Create Listing
    Provide input boxes for users to provide information such as book title, author, ISBN, price wanted, condition of book, etc.
    Send all of that data to the database.
    Dependencies: ability to input all possible information about the book they are listing, user must have been able to login
 2. Display Listings
    Provide a list of all of the user’s listings.
    Dependencies: Firebase must return a collection of listing documents for the specific user
 */
//
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { withStyles } from '@material-ui/core/styles';
import React from "react";

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
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

class MyListings extends ReactComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentListings: [],
            menuOpen: false
        }
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
            menuOpen: !curr_state
        });
    }

    componentDidMount() {
        var status = localStorage.getItem('userStatues');
        if (status == 'invalid') {
            window.location.href = '/';
        }

        var tempListings = [];

        firebase.firestore().collection("listsings").where("owner", "==", firebase.auth().currentUser).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var gather = [doc.id, doc.data(), false];
                tempListings.push(gather);
            });
            this.setState({
                currentListings: tempListings
            });
        });
    }

    render() {
        return (
            <div>
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
                        <ListItem button key="my_listings_nav" onClick={() => { window.location.href = "/mylistings"; }}>
                            <ListItemIcon><MyListingsIcon /></ListItemIcon>
                            <ListItemText primary="My Listings" />
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
                    <Typography variant='h3' style={{ margin: "10px" }}>Recent Listings</Typography>
                    <Card>
                        {this.state.currentListings.map((item) => (
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

