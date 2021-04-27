import React, {Component} from 'react';
import '../w3.css'
import '../App.css'
import firebase from "firebase";

import NavigationMenu from './NavigationMenu.js';
import Logo from '../BadgerTextbooksLogoV1.png';

import {
    AppBar,
    Toolbar,
    Container,
    Paper,
    Typography,
    Drawer,
    Divider,
    TextField,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const backgroundBeige = '#d2b48c';
const badgerRed = '#c5050c';

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
        document.body.style.backgroundColor = backgroundBeige;

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
                image_url: this.state.imageURL
            }).then(() => {
                    window.location = "/listing";
                }
            )
        }
    }
    // handleRemoveSubmit = (e) => {
    //     var user_email = firebase.auth().currentUser.email;
    //     var date = Date().toLocaleString();
    //
    //     var documentId = sessionStorage.getItem('currentListing')
    //     console.log(firebase.firestore().collection('listings').doc(documentId))
    //     firebase.firestore().collection('listings').doc(documentId).delete().then(() => {
    //             window.location = "/mylistings";
    //         }
    //     )
    // }


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

    toggleBackButton = (event) => {
        window.location.href = "/listing"
    }

    render() {
        return (
            <div>
                <AppBar style={{ background: badgerRed }} position="static">
                    <Toolbar>
                        <IconButton title="menu_btn" onClick={this.toggleBackButton} style={{ zIndex: 1, marginTop: '15px', marginBottom: '15px' }}>
                            <ArrowBackIosIcon/>
                        </IconButton>
                        <Typography style={{position: 'absolute', fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', left: 0, right: 0}}>
                            <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger Textbooks
                        </Typography>
                    </Toolbar>
                </AppBar>

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

                <Container>
                    <Paper variant="outlined" square style={{height: "100vh", padding: "20px"}}>
                        <Typography variant="h5" style={{marginTop: '20px', marginBottom: '10px'}}>Edit Your Listing</Typography>
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
                        >Confirm Edit</Button>
                    </Paper>
                </Container>
            </div>
        )
    }
}

export default EditListing;
