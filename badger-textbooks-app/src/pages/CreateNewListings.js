import React, {Component} from 'react';
import '../w3.css'
import '../App.css'
import firebase from "firebase";

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import {
    AppBar,
    Toolbar,
    Typography,
    Divider,
    Paper,
    Container,
    Button,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Drawer
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

const backgroundBeige = '#d2b48c';
const badgerRed = '#c5050c';

//book title, author, ISBN, price wanted, condition of book, class_used
export class CreateNewListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            ISBN: 0,
            price: 0,
            condition: 'Brand-New',
            class_used: '',
            alertOpen: false,
            menuOpen: false,
            imageURL: '',
            sellerName: '',
        }
    }

    componentDidMount () {
        firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
            //User is not siged in...redirect to login page
            window.location.href = "/";
          }
        });
        document.body.style.backgroundColor = backgroundBeige;
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
          menuOpen: !curr_state
        });
    }

    handleSubmit = (e) => {
        if (this.state.author === "" || this.state.class === "" || this.state.title === "") {
            this.setState({
                alertOpen: true
            });
        } else {
            var uid = firebase.auth().currentUser.uid;
            var user_email = firebase.auth().currentUser.email;
            var date = Date().toLocaleString();

            var listingRef;
            var userRef;

            firebase.firestore().collection("users").where("uid", "==", uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var data = doc.data();
                    var username = data.name
                    firebase.firestore().collection('listings').add({
                        active: true,
                        ISBN: this.state.ISBN.toString(),
                        author: this.state.author,
                        search_author: this.state.author.toLowerCase(),
                        class: this.state.class_used.toLowerCase(),
                        condition: this.state.condition,
                        price: this.state.price,
                        title: this.state.title,
                        search_title: this.state.title.toLowerCase(),
                        seller: user_email,
                        seller_uid: uid,
                        time_created: date,
                        image_url: this.state.imageURL,
                        seller_name: username
                    }).then((docRef) => {
                        listingRef = docRef;
                        firebase.firestore().collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                userRef = doc.id;
                            });
                            firebase.firestore().collection("users").doc(userRef).update({
                                listings: firebase.firestore.FieldValue.arrayUnion(listingRef)
                            }).then(() => {
                                window.location = "/mylistings";
                            });
                        });
                    });
                });

            });
        }
    }

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    handleAuthorChange = (e) => {
        this.setState({
            author: e.target.value
        })
    }

    handleISBNChange = (e) => {
        this.setState({
            ISBN: e.target.value
        })
    }

    handlePriceChange = (e) => {
        this.setState({
            price: e.target.value
        })
    }

    handleClassChange = (e) => {
        this.setState({
            class_used: e.target.value
        })
    }

    handleConditionChange = (e) => {
        this.setState({
            condition: e.target.value
        })
    }

    handleImageChange = (e) => {
        //Adds image to storage
        const file = e.target.files[0]
        var storage = firebase.storage()
        var storageRef = storage.ref()
        const fileRef = storageRef.child(file.name)
        fileRef.put(file).then(() => {
            //Saved image file path
            storageRef.child(file.name).getDownloadURL().then((url) => {
                this.setState({imageURL: url})
            })
        })
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

                <Dialog
                    open={this.state.alertOpen}
                    onClose={() => {this.setState({alertOpen: false})}}
                >
                    <DialogTitle>{"Oops! Looks like we are missing some information."}</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Make sure that all fields marked by a * have been filled out.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button 
                        style={{color: '#c5050c'}}
                        onClick={() => {this.setState({alertOpen: false})}} 
                        color="primary" 
                        autoFocus
                    >
                        OK
                    </Button>
                    </DialogActions>
                </Dialog>

                <Container>
                    <Paper variant="outlined" square style={{height: "100vh", padding: "20px"}}>
                        <Typography variant="h5" style={{marginTop: '20px', marginBottom: '10px'}}>Create a New Listing</Typography>
                        <Divider/>
                        <TextField
                            title='titleInput'
                            label="Textbook Title*"
                            variant="filled"
                            fullWidth
                            style={{ marginTop: "20px" }}
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                            autoFocus
                        />
                        <TextField
                            title='authorInput'
                            label="Author*"
                            variant="filled"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            value={this.state.author}
                            onChange={this.handleAuthorChange}
                        />
                        <TextField
                            title='classInput'
                            label="Class Used For*"
                            variant="filled"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            value={this.state.class_used}
                            onChange={this.handleClassChange}
                        />
                        <TextField
                            title='priceInput'
                            label="Price"
                            variant="filled"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            value={this.state.price}
                            onChange={this.handlePriceChange}
                            type="number"
                        />
                        <TextField
                            title='isbnInput'
                            label="ISBN"
                            variant="filled"
                            fullWidth
                            style={{ marginTop: "10px" }}
                            value={this.state.ISBN}
                            onChange={this.handleISBNChange}
                            type="number"
                        />
                        <FormControl style={{ width: "100%", marginTop: "10px" }}>
                            <InputLabel id="filter-select-label" style={{marginLeft: "2px"}}>Condition</InputLabel>
                            <Select
                                labelId="filter-select-label"
                                data-testid="filter_slct_creat"
                                variant="filled"
                                value={this.state.condition}
                                onChange={this.handleConditionChange}
                            >
                                <MenuItem value={"Brand-New"}>Brand New</MenuItem>
                                <MenuItem value={"Like-New"}>Like New</MenuItem>
                                <MenuItem value={"Good"}>Good</MenuItem>
                                <MenuItem value={"Fair"}>Fair</MenuItem>
                                <MenuItem value={"Poor"}>Poor, but still usable</MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{marginTop: "10px", marginBottom: "20px", backgroundColor: "#ededed"}}>
                            <label style={{float: "left", marginLeft: "10px"}}>Textbook Image: </label>
                            <input className="w3-input w3-hover-light-gray"
                                type='file'
                                onChange={this.handleImageChange}
                            />
                        </div>
                        <Divider/>
                        <Button 
                            style={{color: '#ffffff', backgroundColor: '#c5050c', marginTop: "20px", width: "50%"}}
                            variant="contained" 
                            fullWidth 
                            onClick={this.handleSubmit}
                        >Create</Button>
                    </Paper>
                </Container>
            </div>
        )
    }
}

export default CreateNewListing;
