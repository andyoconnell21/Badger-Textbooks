import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import {
    Box,
    Grid,
    Divider,
    AppBar,
    Toolbar,
    Typography,
    Card,
    CardActions,
    CardContent,
    Button,
    IconButton,
    Drawer
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

const idIndex = 0;
const dataIndex = 1;
const white = '#ffffff';
const backgroundBeige = '#d2b48c';
const badgerRed = '#c5050c';

class MyListings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeListings: [],
            disabledListings: [],
            menuOpen: false,
            user: ""
        }
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
            menuOpen: !curr_state
        });
    }

    componentDidMount() {
        document.body.style.backgroundColor = backgroundBeige;
        
        var listKeys = [];
        var tempList = [];
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
            else {  
                firebase.firestore().collection("users").where("uid", "==", user.uid).get().then((querySnapshot) => {
                    var id = "";
                    querySnapshot.forEach((doc) => {
                        id = doc.id;
                        var data = doc.data();
                        listKeys = data.listings;
                        this.setState({
                            user: data.name
                        });
                    });
                    var updatedListKeys = listKeys;
                    listKeys.forEach((key) => {
                        firebase.firestore().collection("listings").doc(key.id).get().then((nextQuerySnapshot) => {
                            var gather = [nextQuerySnapshot.id, nextQuerySnapshot.data()];
                            tempList.push(gather); 
                            var tempActiveListings = [];
                            var tempDisabledListings = [];

                            tempList.forEach((listing) => {
                                if (listing[dataIndex].active) {
                                    tempActiveListings.push(listing);
                                } else {
                                    tempDisabledListings.push(listing);
                                }
                            });
                            this.setState({
                                activeListings: tempActiveListings,
                                disabledListings: tempDisabledListings
                            });
                        }).catch((error) => {
                            console.error("Listing DNE. Removing from list of keys.", error);
                            updatedListKeys = listKeys.filter((check_key) => {
                                return check_key !== key;
                            });
                            firebase.firestore().collection('users').doc(id).update({
                                listings: updatedListKeys
                            });
                        });
                        
                    });
                });
            }
        }.bind(this));
    }

    addDefaultSrc(ev) {
        ev.target.src = "https://badgerchemistnews.chem.wisc.edu/wp-content/themes/uw-theme/dist/images/bucky-head.png"
      }

    render() {
        return (
            <div>
                <AppBar style={{ background: badgerRed }} position="static">
                    <Toolbar>
                        <IconButton title="menu_btn" onClick={this.toggleMenu} style={{ zIndex: 1, marginTop: '15px', marginBottom: '15px' }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography style={{position: 'absolute', fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', left: 0, right: 0}}>
                            <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger Textbooks
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <NavigationMenu/>
                </Drawer>

                <Typography variant="h4" style={{marginTop: '20px'}}>
                    My Active Listings
                </Typography>

                <Box style={{display: this.state.defaultDisplay, margin:'20px'}}>
                    <Grid container justify='center' spacing={3}>
                        {this.state.activeListings.map((item) => (
                            <Grid item>
                                <Card style={{width: "300px"}}>
                                <CardContent>
                                    <Grid container style={{height: '60px'}}>
                                    <Grid item>
                                        <img onError={this.addDefaultSrc} className="img-responsive" 
                                        src={item[dataIndex].image_url} width="50" height="60" alt="" style={{backgroundColor: "#eeeeee"}}/>
                                    </Grid>
                                    <Grid item xs>
                                        <div style={{overflow: 'auto', textOverflow: "ellipsis", height: '4rem'}}> 
                                        <Typography variant='h6'>
                                            {item[dataIndex].title}
                                        </Typography>
                                        </div>
                                    </Grid>
                                    </Grid>
                                    <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                                    <Grid container>
                                    <Grid item xs>
                                        <Typography color="textSecondary" style={{left: 0}}>
                                        Price:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography color="textSecondary">
                                        ${item[dataIndex].price}
                                        </Typography>
                                    </Grid>
                                    </Grid>
                                    <Grid container>
                                    <Grid item xs>
                                        <Typography color="textSecondary">
                                        Seller:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography color="textSecondary">
                                        {item[dataIndex].seller_name}
                                        </Typography>
                                    </Grid>
                                    </Grid>
                                </CardContent>
                                
                                <CardActions>
                                    <Button title="details_button" fullWidth style = {{backgroundColor: badgerRed, color: white}} onClick={() => {
                                    sessionStorage.setItem('currentListing', item[idIndex]);
                                    window.location.href = "/listing";
                                    }}>
                                    See Details 
                                    </Button>
                                </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider style={{margin: '10px'}}/>

                <Typography variant="h4" style={{marginTop: '20px'}}>
                    My Disabled Listings
                </Typography>

                <Box style={{display: this.state.defaultDisplay, margin:'20px'}}>
                    <Grid container justify='center' spacing={3}>
                        {this.state.disabledListings.map((item) => (
                            <Grid item>
                                <Card style={{width: "300px"}}>
                                <CardContent>
                                    <Grid container style={{height: '60px'}}>
                                    <Grid item>
                                        <img onError={this.addDefaultSrc} className="img-responsive" 
                                        src={item[dataIndex].image_url} width="50" height="60" alt="" style={{backgroundColor: "#eeeeee"}}/>
                                    </Grid>
                                    <Grid item xs>
                                        <div style={{overflow: 'auto', textOverflow: "ellipsis", height: '4rem'}}> 
                                        <Typography variant='h6'>
                                            {item[dataIndex].title}
                                        </Typography>
                                        </div>
                                    </Grid>
                                    </Grid>
                                    <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                                    <Grid container>
                                    <Grid item xs>
                                        <Typography color="textSecondary" style={{left: 0}}>
                                        Price:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography color="textSecondary">
                                        ${item[dataIndex].price}
                                        </Typography>
                                    </Grid>
                                    </Grid>
                                    <Grid container>
                                    <Grid item xs>
                                        <Typography color="textSecondary">
                                        Seller:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography color="textSecondary">
                                        {item[dataIndex].seller_name}
                                        </Typography>
                                    </Grid>
                                    </Grid>
                                </CardContent>
                                
                                <CardActions>
                                    <Button title="details_button" fullWidth style = {{backgroundColor: badgerRed, color: white}} onClick={() => {
                                    sessionStorage.setItem('currentListing', item[idIndex]);
                                    window.location.href = "/listing";
                                    }}>
                                    See Details 
                                    </Button>
                                </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        )
    }
}

export default MyListings
