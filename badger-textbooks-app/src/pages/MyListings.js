import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';

import React from "react";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

import MenuIcon from '@material-ui/icons/Menu';

const idIndex = 0;
const dataIndex = 1;

class MyListings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listings: [],
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
        document.body.style.backgroundColor = '#d2b48c';
        
        
        var listIDs = [];
        var tempList = [];
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
            else {  
                this.setState({ user: user.email });
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
                                listings: tempList
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
                    <NavigationMenu/>
                </Drawer>

                <Typography variant="h4" style={{marginTop: '20px'}}>
                    Active Listings
                </Typography>

                <Box style={{display: this.state.defaultDisplay, margin:'20px'}}>
                    <Grid container justify='center' spacing={3}>
                        {this.state.listings.map((item) => (
                            <Grid item>
                                <Card style={{width: "300px"}}>
                                <CardContent>
                                    <Grid container style={{height: '60px'}}>
                                    <Grid item>
                                        <img src={item[dataIndex].image_url} width="50" height="60" alt="" style={{backgroundColor: "#eeeeee"}}/>
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
                                        {item[dataIndex].owner}
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
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider style={{margin: '10px'}}/>

                <Typography variant="h4" style={{marginTop: '10px'}}>
                    Disabled Listings
                </Typography>
            </div>
        )
    }
}

export default MyListings