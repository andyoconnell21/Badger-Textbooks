import React, {Component} from 'react';

import '../w3.css'
import '../App.css'
import firebase from "firebase";

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';

import MenuIcon from '@material-ui/icons/Menu';
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const backgroundGrey = '#dadfe1';
const badgerRed = '#c5050c';

class ReportListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listing_id: '',
            listing_title: '',
            reporter_uid: '',
            reporter_name: '',
            primary_reasons: [],
            other_reasons: ''
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            }
        });
        var documentId = sessionStorage.getItem('currentListing');
        document.body.style.backgroundColor = backgroundGrey;

        firebase.firestore().collection("listings").doc(documentId ? documentId : "0").get()
            .then((doc) => {
                var data = doc.data();
                this.setState({
                    listing_id: documentId,
                    title: data.title,
                    sellerName: data.seller_name
                })
            })
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
            menuOpen: !curr_state
        });
    }

    handleSubmit = (e) => {
        var uid = firebase.auth().currentUser.uid;
        var date = Date().toLocaleString();

        firebase.firestore().collection("users").where("uid", "==", uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var data = doc.data();
                firebase.firestore().collection('reports').add({
                    listing_id: this.state.listing_id,
                    other_reasons: this.state.other_reasons,
                    reporter_name: data.name,
                    reporter_uid: data.uid,
                    time_reported: date,
                    primary_reasons: this.state.primary_reasons,
                }).then((docRef) => {
                    window.location = "/home";
                });
            });
        })
    }


    handleCheckboxChange = event => {
        let newArray = [...this.state.primary_reasons, event.target.id];
        if (this.state.primary_reasons.includes(event.target.id)) {
            newArray = newArray.filter(reason => reason !== event.target.id);
        }
        this.setState({
            primary_reasons: newArray
        });
    };


    handleOtherReasons = (e) => {
        this.setState({
            other_reasons: e.target.value
        })
    }


    render() {
        const {title, sellerName} = this.state

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

                <React.Fragment>
                    <form className="form-box" style={{width: "80%", backgroundColor: 'lightgray'}}>
                        <p style={{fontSize: '30px'}}>Report Submission Form</p>
                        <Divider style={{margin: "10px"}}/>
                        <p style={{fontSize: '25px', border:'1px'}}>Listing Title: {title}</p>
                        <p style={{fontSize: '20px', border:'1px'}}>Seller: {sellerName}</p>
                        <Divider style={{margin: "10px"}}/>
                        <p style={{fontSize: '16px'}}>Select your reason(s) for reporting this listing:  </p>

                        <label className="container">
                        <input type="checkbox" className="custom-control-input" id="Inappropriate"
                                    title="inap_check"
                                    value="Inappropriate"
                                    onChange={this.handleCheckboxChange}/>
                            <span className="checkmark"></span>
                            <label className="custom-control-label" htmlFor="Inappropriate">Listing is inappropriate</label>
                        </label>

                        <label className="container">
                            <input type="checkbox" className="custom-control-input" id="notTextbook"
                                    value="notTextbook"
                                    onChange={this.handleCheckboxChange}/>
                            <span className="checkmark"></span>
                            <label className="custom-control-label" htmlFor="notTextbook">Not a textbook</label>
                        </label>

                        <label className="container">
                            <input type="checkbox" className="custom-control-input" id="notSerious"
                                    value="notSerious"
                                    onChange={this.handleCheckboxChange}/>
                            <span className="checkmark"></span>
                            <label className="custom-control-label" htmlFor="notSerious">Not a serious
                                listing</label>
                        </label>

                        <div>
                            <label style={{fontSize: '16px',border:'1px'}}> Other Reasons (optional):  </label>
                            <input className="w3-input w3-hover-light-gray"
                                    title="other"
                                    type='text'
                                    size=""
                                    onChange={this.handleOtherReasons}
                            />
                        </div>
                        <Divider style={{margin: "10px"}}/>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <Button
                                    title="cancel_btn"
                                    style={{color: '#ffffff', backgroundColor: '#c5050c'}}
                                    variant="contained"
                                    fullWidth
                                    onClick={() => {
                                        window.location.href = "/listing";}
                                    }
                                > Cancel </Button>
                            </Grid>
                            <Grid item xs>
                                <Button
                                    title="file_btn"
                                    style={{color: '#ffffff', backgroundColor: '#c5050c'}}
                                    variant="contained"
                                    fullWidth
                                    onClick={this.handleSubmit}

                                >File Report</Button>
                            </Grid>
                        </Grid>
                    </form>
                </React.Fragment>
            </div>
        )
    }
}

export default ReportListing;