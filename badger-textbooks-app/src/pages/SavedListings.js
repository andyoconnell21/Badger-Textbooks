import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';

import BackIcon from '@material-ui/icons/ArrowBackIos';

const dataIndex = 1;
const idIndex = 0;

class SavedListing extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            menuOpen: false,
            savedListings: [],
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
            else{
                var uid = user.uid

                //Get docID's of users saved listings
                var listKeys = [];
                var tempList = [];

                firebase.firestore().collection("users").where("uid", "==", uid).get().then((querySnapshot) => {
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
        });

        document.body.style.backgroundColor = '#dadfe1';
    
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
          menuOpen: !curr_state
        });
      }

    removeSavedListing = (event) => {

    }

    addDefaultSrc(ev) {
        ev.target.src = "https://badgerchemistnews.chem.wisc.edu/wp-content/themes/uw-theme/dist/images/bucky-head.png"
    }

    render() {
        return(
            <div>
                <AppBar position = "static" style={{background:'#c5050c'}}>
                    <Toolbar>
                        <IconButton onClick={this.toggleMenu}> 
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant='h6' style={{fontFamily: 'sans-serif', fontSize: '25px', margin: 'auto'}}>
                            Your Saved Listings
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <NavigationMenu/>
                </Drawer>

                <Box style={{display: this.state.defaultDisplay, margin:'20px'}}>
                    <Typography variant='h4' style={{ margin: "10px" }}>
                        Here are your saved listings
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
                                    {item[dataIndex].seller}
                                    </Typography>
                                </Grid>
                                </Grid>
                            </CardContent>
                            
                            <CardActions>
                                <Button fullWidth style = {{backgroundColor: '#c5050c', color: '#ffffff'}} onClick={() => {
                                sessionStorage.setItem('currentListing', item[idIndex]);
                                window.location.href = "/listing";
                                }}>
                                See Details 
                                </Button>
                            </CardActions>
                            <CardActions>
                                <Button fullWidth style = {{backgroundColor: '#c5050c', color: '#ffffff', marginTop:'-10px'}} onClick={this.removeSavedListing}>
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
