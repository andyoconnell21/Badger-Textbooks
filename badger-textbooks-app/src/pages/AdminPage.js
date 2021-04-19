import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import MenuIcon from '@material-ui/icons/Menu';
import NextIcon from '@material-ui/icons/NavigateNext';
import DeleteIcon from '@material-ui/icons/Delete';

const idIndex = 0;
const dataIndex = 1;

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reports: [],
            menuOpen: false
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
            firebase.firestore().collection('users').where('uid', '==', user.uid).get().then((querySnapshot) => {
                var isAdmin = false;
                querySnapshot.forEach((doc) => {
                    isAdmin = doc.data().isAdmin;
                });
                if (!isAdmin) {
                    //User is not admin...redirect to home page
                    window.location.href = "/home"
                }
            });
        });
        document.body.style.backgroundColor = '#d2b48c';
        this.updateReports();
    }

    updateReports = () => {
        var tempReports = [];
        firebase.firestore().collection("reports").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var gather = [doc.id, doc.data()];
                tempReports.push(gather);
            });
            tempReports.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a[dataIndex].time_reported) - new Date(b[dataIndex].time_reported);
            }); 
            this.setState({
                reports: tempReports
            });
        });
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
            menuOpen: !curr_state
        });
    }

    handleDelete = (report_id) => {
        firebase.firestore().collection("reports").doc(report_id).delete().then(() => {
            this.updateReports();
        })
    }

    handleGoToListing = (listing_id) => {
        sessionStorage.setItem('currentListing', listing_id);
        window.location.href = "/listing";
    }

    render() {
        return (
            <div>
                <AppBar style ={{ background: '#c5050c' }} position="static">
                    <Toolbar>
                        <IconButton title="menu_btn" onClick={this.toggleMenu}> 
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h3" style={{flexGrow: 1}}>
                            <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger-Textbooks
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer title="nav_menu" anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <NavigationMenu/>
                </Drawer>

                <Container>
                    <Paper>
                        {this.state.reports.map((report) => (
                            <div>
                                <Grid container>
                                    <Grid item xs>
                                        <Typography><b>Report ID: </b>{report[idIndex]}</Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography><b>Reported By: </b>{report[dataIndex].reporter_name}</Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography><b>Reasons for Report: </b></Typography>
                                        {report[dataIndex].primary_reasons.map((reason) => (
                                            <Typography>- {reason}</Typography>
                                        ))}
                                    </Grid>
                                    <Grid item xs>
                                        <Typography><b>Other Notes: </b>{report[dataIndex].other_reasons}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton
                                            onClick={() => {this.handleDelete(report[idIndex])}}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton
                                            onClick={() => {this.handleGoToListing(report[dataIndex].listing_id)}}
                                        >
                                            <NextIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider/>
                            </div>
                        ))}
                    </Paper>
                </Container>
            </div>
        )
    };
}

export default Admin;