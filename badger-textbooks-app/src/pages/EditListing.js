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
export class EditListing extends Component {
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
                    author: data.author,
                    class_used: data.class,
                    owner: data.owner,
                    price: data.price,
                    date: data.time_created,
                    title: data.title,
                    condition: data.condition,
                    image: data.image_url,
                    ISBN: data.ISBN
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
        if (this.state.author === "" || this.state.class === "" || this.state.title === "") {
            this.setState({
                alertOpen: true
            });
        } else {
            var user_email = firebase.auth().currentUser.email;
            var date = Date().toLocaleString();

            var documentId = sessionStorage.getItem('currentListing')
            console.log(firebase.firestore().collection('listings').doc(documentId))
            firebase.firestore().collection('listings').doc(documentId).update({
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
            }).then(() => {
                    window.location = "/listing";
                }
            )
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
                <AppBar style={{background: '#c5050c'}} position="static">
                    <Toolbar>
                        <IconButton onClick={this.toggleMenu}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            variant='h6'
                            style={{
                                flexGrow: 1,
                                fontFamily: 'sans-serif',
                                fontSize: '25px',
                                margin: '25px',
                                textAlign: 'center'
                            }}
                        >Edit Listing</Typography>
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <List>
                        <ListItem button key="home_nav" onClick={() => {
                            window.location.href = "/home";
                        }}>
                            <ListItemIcon><HomeIcon/></ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItem>
                        <Divider/>
                        <ListItem button key="my_listings_nav" onClick={() => {
                            window.location.href = "/mylistings";
                        }}>
                            <ListItemIcon><MyListingsIcon/></ListItemIcon>
                            <ListItemText primary="My Listings"/>
                        </ListItem>
                        <Divider/>
                        <ListItem button key="saved_listings_nav" disabled>
                            <ListItemIcon><SavedIcon/></ListItemIcon>
                            <ListItemText primary="Saved Listings"/>
                        </ListItem>
                        <Divider/>
                        <ListItem button key="account_nav" disabled>
                            <ListItemIcon><AccountIcon/></ListItemIcon>
                            <ListItemText primary="Account"/>
                        </ListItem>
                    </List>
                </Drawer>

                <Dialog
                    open={this.state.alertOpen}
                    onClose={() => {
                        this.setState({alertOpen: false})
                    }}
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
                            onClick={() => {
                                this.setState({alertOpen: false})
                            }}
                            color="primary"
                            autoFocus
                        >
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                <form className="form-box" style={{width: "80%", backgroundColor: '#F8F8F8'}}>
                    <div>
                        <label>Book Title*: </label>
                        <input className="w3-input w3-hover-light-gray"
                               type='text'
                               size="sm"
                               value={title}
                               onChange={this.handleTitleChange.bind(this)}
                        />
                    </div>
                    <div>
                        <label>Author*: </label>
                        <input className="w3-input w3-hover-light-gray"
                               size="sm"
                               type='text'
                               value={author}
                               onChange={this.handleAuthorChange.bind(this)}
                        />
                    </div>
                    <div>
                        <label>ISBN: </label>
                        <input className="w3-input w3-hover-light-gray"
                               type='text'
                               value={ISBN}
                               pattern="[0-9]+"
                               onChange={this.handleISBNChange.bind(this)}
                        />
                    </div>
                    <div>
                        <label>Desired Price: </label>
                        <input className="w3-input w3-hover-light-gray"
                               type='number'
                               value={price}
                               onChange={this.handlePriceChange.bind(this)}
                        />
                    </div>
                    <div>
                        <label>Class Used For*: </label>
                        <input className="w3-input w3-hover-light-gray"
                               type='text'
                               value={class_used}
                               onChange={this.handleClassChange.bind(this)}
                        />
                    </div>
                    <div>
                        <label>Condition: </label>
                        <select className="w3-input w3-hover-light-gray"
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
                               onChange={this.handleImageChange.bind(this)}
                        />
                    </div>

                    <Divider style={{margin: "10px"}}/>
                    <Button
                        style={{color: '#ffffff', backgroundColor: '#c5050c'}}
                        variant="contained"
                        fullWidth
                        onClick={this.handleSubmit.bind(this)}
                    >Confirm Edit</Button>
                </form>
            </div>
        )
    }
}

export default EditListing;
