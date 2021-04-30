import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import {
    Grid,
    Box,
    Card,
    CardActions,
    CardContent,
    Divider,
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Drawer,
    Typography
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

const dataIndex = 1;
const idIndex = 0;
const white = '#ffffff';
const backgroundBeige = '#d2b48c';
const badgerRed = '#c5050c';

class SavedListing extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            menuOpen: false,
            savedListings: [],
            userUID: '',
        }
    }

    componentDidMount(){
        document.body.style.backgroundColor = backgroundBeige;
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
            else{
                var uid = user.uid
                this.setState({userUID: uid})

                //Get docID's of users saved listings
                var listKeys = [];
                var tempList = [];

                firebase.firestore().collection("users").where("uid", "==", user.uid).get().then((querySnapshot) => {
                    var id = "";
                    querySnapshot.forEach((doc) => {
                        id = doc.id;
                        var data = doc.data();
                        listKeys = data.saved_listings;
                    });
                    var updatedListKeys = listKeys;
                    listKeys.forEach((key) => {
                        firebase.firestore().collection("listings").doc(key).get().then((nextQuerySnapshot) => {
                            var gather = [nextQuerySnapshot.id, nextQuerySnapshot.data()];
                            tempList.push(gather); 

                            this.setState({ savedListings: tempList });

                        }).catch((error) => {
                            console.error("Listing DNE. Removing from list of keys.", error);
                            updatedListKeys = listKeys.filter((check_key) => {
                                return check_key !== key;
                            });
                            firebase.firestore().collection('users').doc(id).update({
                                saved_listings: updatedListKeys
                            });
                        });
                        
                    });
                });
            }
        });
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

    updateSavedListings = (event) => {
        //Go into users firebase account and update savedListings array
        //Get docID's of users saved listings
        var listKeys = [];
        var tempList = [];

        this.setState({ savedListings: [] })

        firebase.firestore().collection("users").where("uid", "==", this.state.userUID).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                listKeys = data.saved_listings;
            });
            listKeys.forEach((key) => {
                firebase.firestore().collection("listings").doc(key).get().then((nextQuerySnapshot) => {
                    var gather = [nextQuerySnapshot.id, nextQuerySnapshot.data()];
                    tempList.push(gather);

                    this.setState({ savedListings: tempList });
                });
            });
        });
    }

    render() {
        return(
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

                <Box style={{display: this.state.defaultDisplay, margin:'20px'}}>
                    <Typography variant='h4' style={{margin:'auto', fontFamily: 'sans-serif' }}>
                        Your Saved Listings
                    </Typography>
                    <Grid container spacing={3} justify='center' style={{ marginTop: "10px" }}>
                        {this.state.savedListings.map((item) => (
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
                                        <Button fullWidth style = {{backgroundColor: badgerRed, color: white}} onClick={() => {
                                            sessionStorage.setItem('currentListing', item[idIndex]);
                                            window.location.href = "/listing";
                                        }}>
                                            See Details
                                        </Button>
                                    </CardActions>
                                    <CardActions>
                                        <Button fullWidth style = {{backgroundColor: badgerRed, color: white, marginTop:'-10px'}} onClick={() => {
                                            var userRef = '';
                                            firebase.firestore().collection("users").where("uid", "==", this.state.userUID).get().then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    userRef = doc.id
                                                })
                                                firebase.firestore().collection('users').doc(userRef).update({
                                                    saved_listings: firebase.firestore.FieldValue.arrayRemove(item[idIndex])
                                                }).then(() => {
                                                    this.updateSavedListings();
                                                })
                                            })
                                        }}>
                                            Remove from Saved Listings
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

export default SavedListing