import React, {Component} from 'react';
import '../w3.css'
import '../App.css'
import firebase from "firebase";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';

//book title, author, ISBN, price wanted, condition of book, class_used
export class CreateNewListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            ISBN: 0,
            price: 0,
            condition: 'brand-new',
            class_used: '',
            alerOpen: false,
            menuOpen: false,
            imageURL: '',
        }
    }

    componentDidMount () {
        firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
            //User is not siged in...redirect to login page
            window.location.href = "/";
          }
        }); 
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
            var user_email = firebase.auth().currentUser.email;
            var date = Date().toLocaleString();

            var listingRef;
            var userRef;

            firebase.firestore().collection('listings').add({
                ISBN: this.state.ISBN,
                author: this.state.author,
                search_author: this.state.author.toLowerCase(),
                class: this.state.class_used.toLowerCase(),
                condition: this.state.condition,
                price: this.state.price,
                title: this.state.title,
                search_title: this.state.title.toLowerCase(),
                owner: user_email,
                time_created: date,
                image_url: this.state.imageURL
            }).then((docRef) => {
                listingRef = docRef;
                firebase.firestore().collection("users").where('email', '==', user_email).get().then((querySnapshot) => {
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
        const {title, author, ISBN, price, condition, class_used, image} = this.state
        return (
            <div>
                <AppBar style ={{ background:'#c5050c' }} position="static">
                    <Toolbar>
                        <IconButton onClick={this.toggleMenu}> 
                            <MenuIcon/>
                        </IconButton>
                        <Typography 
                            variant='h6' 
                            style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '25px', margin: '25px', textAlign: 'center'}}
                        >Create New Listing</Typography>
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <List>
                        <ListItem button key="home_nav" onClick={() => {window.location.href = "/home";}}>
                            <ListItemIcon><HomeIcon/></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <Divider/>
                        <ListItem button key="my_listings_nav" onClick={() => {window.location.href = "/mylistings";}}>
                            <ListItemIcon><MyListingsIcon/></ListItemIcon>
                            <ListItemText primary="My Listings" />
                        </ListItem>
                        <Divider/>
                        <ListItem button key="saved_listings_nav" disabled>
                            <ListItemIcon><SavedIcon/></ListItemIcon>
                            <ListItemText primary="Saved Listings" />
                        </ListItem>
                        <Divider/>
                        <ListItem button key="account_nav" disabled>
                            <ListItemIcon><AccountIcon/></ListItemIcon>
                            <ListItemText primary="Account" />
                        </ListItem>
                    </List>
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

                <form className="form-box" style={{width: "80%", backgroundColor: '#d2b48c'}}>
                    <div>
                        <label>Book Title*: </label>
                        <input className="w3-input w3-hover-light-gray"
                            title='titleInput'
                            type='text'
                            size="sm"
                            value={title}
                            onChange={this.handleTitleChange}
                        />
                    </div>
                    <div>
                        <label>Author*: </label>
                        <input className="w3-input w3-hover-light-gray"
                            title='authorInput'
                            size="sm"
                            type='text'
                            value={author}
                            onChange={this.handleAuthorChange}
                        />
                    </div>
                    <div>
                        <label>ISBN: </label>
                        <input className="w3-input w3-hover-light-gray"
                            title='isbnInput'
                            type='text'
                            value={ISBN}
                            pattern="[0-9]+"
                            onChange={this.handleISBNChange}
                        />
                    </div>
                    <div>
                        <label>Desired Price: </label>
                        <input className="w3-input w3-hover-light-gray"
                            title='priceInput'
                            type='number'
                            value={price}
                            onChange={this.handlePriceChange}
                        />
                    </div>
                    <div>
                        <label>Class Used For*: </label>
                        <input className="w3-input w3-hover-light-gray"
                            title='classInput'
                            type='text'
                            value={class_used}
                            onChange={this.handleClassChange}
                        />
                    </div>
                    <div>
                        <label>Condition: </label>
                        <select className="w3-input w3-hover-light-gray"
                                title='conditionInput'
                                value={condition}
                                onChange={this.handleConditionChange}>
                            <option value='Brand-new'>Brand new</option>
                            <option value='Like-New'>Like New</option>
                            <option value='Good'>Good</option>
                            <option value='Fair'>Fair</option>
                            <option value='Poor'>Poor, but still usable</option>
                        </select>
                    </div>
                    <div>
                        <label>Image of Textbook: </label>
                        <input className="w3-input w3-hover-light-gray"
                            type='file'
                            onChange={this.handleImageChange}
                        />
                    </div>

                    <Divider style={{margin: "10px"}}/>
                    <Button 
                        style={{color: '#ffffff', backgroundColor: '#c5050c'}}
                        variant="contained" 
                        fullWidth 
                        onClick={this.handleSubmit}
                    >Create</Button>
                </form>
            </div>
        )
    }
}

export default CreateNewListing;
