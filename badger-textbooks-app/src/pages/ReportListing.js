import React, {Component} from 'react';

import '../w3.css'
import '../App.css'
import firebase from "firebase";

import NavigationMenu from './NavigationMenu';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';

import MenuIcon from '@material-ui/icons/Menu';
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';


export class ReportListing extends Component {
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
        var documentId = sessionStorage.getItem('currentListing')
        document.body.style.backgroundColor = '#dadfe1';

        firebase.firestore().collection("listings").doc(documentId).get()
            .then((doc) => {
                var data = doc.data();
                this.setState({
                    listing_id: documentId,
                    title: data.title,
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
                    window.location = "/mylistings";
                });
            });

        });
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
        const {title} = this.state

            return (
            <div>
                <div>
                    <AppBar position="static" style={{background: '#c5050c'}}>
                        <Toolbar>
                            <IconButton onClick={this.toggleMenu}>
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant='h6'
                                        style={{fontFamily: 'sans-serif', fontSize: '25px', margin: 'auto'}}>
                                Report a Listing
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                        <NavigationMenu/>
                    </Drawer>
                </div>
                <div>
                    <React.Fragment>
                        <form className="form-box" style={{width: "80%", backgroundColor: 'lightgray'}}>
                            <p style={{background:"whitesmoke",fontSize: '16px',border:'1px'}}>Name of Listing: {title}</p>
                            <p style={{fontSize: '16px'}}>Select your reason(s) for reporting this listing:  </p>

                            <label className="container">
                            <input type="checkbox" class="custom-control-input" id="Inappropriate"
                                       value="Inappropriate"
                                       onChange={this.handleCheckboxChange}/>
                                <span className="checkmark"></span>
                                <label class="custom-control-label" for="Inappropriate">Listing is inappropriate</label>
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
                                       title='titleInput'
                                       type='text'
                                       size=""
                                       onChange={this.handleOtherReasons}
                                />
                            </div>
                            <Divider style={{margin: "10px"}}/>
                            <Button
                                style={{color: '#ffffff', backgroundColor: '#c5050c'}}
                                variant="contained"
                                fullWidth
                                onClick={this.handleSubmit}

                            >File Report</Button>
                            <Divider style={{margin: "10px"}}/>
                            <Button
                                style={{color: '#ffffff', backgroundColor: '#c5050c'}}
                                variant="contained"
                                fullWidth
                                onClick={() => {
                                    window.location.href = "/listing";}
                                }
                            > Cancel </Button>
                        </form>

                    </React.Fragment>
                </div>
            </div>


        )
    }
}

export default ReportListing;



