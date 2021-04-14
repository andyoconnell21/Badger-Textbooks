import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import ChatIcon from '@material-ui/icons/Chat';
import ReportIcon from '@material-ui/icons/Report';

class UserAccount extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userAccountEmail: '',
            userAccountName: '',
            userAccountImage: '',
            hiddenRateUser: false,
            setUserRating: '',
            userAccountRating: '',
        }
    }

    componentDidMount(){
        this.setState({userAccountEmail: sessionStorage.getItem('userAccountEmail')})

        //Get relevant information of that user
        firebase.firestore().collection('users').where("email", "==", sessionStorage.getItem('userAccountEmail')).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({
                    userAccountName: doc.data().name
                })
                var tempUserRating = 0;
                for(var i = 0; i < doc.data().user_ratings.length; i++){
                    var tempValue = parseInt(doc.data().user_ratings[i])
                    tempUserRating = tempUserRating + tempValue
                }
                tempUserRating = tempUserRating / doc.data().user_ratings.length
                this.setState({userAccountRating: tempUserRating})
            })
        })

        document.body.style.backgroundColor = '#dadfe1';

    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
          menuOpen: !curr_state
        });
    }

    addDefaultSrc(ev) {
        ev.target.src = "https://firebasestorage.googleapis.com/v0/b/badgertextbooks-2919f.appspot.com/o/userAccountImage.png?alt=media&token=91c14802-542d-4723-8c55-405b7552c8fa"
    }

    rateUser = (event) => {
        this.setState({hiddenRateUser: true})
    }

    sendUserRating = (event) => {
        //Capture the rating and store it in firebase 

        var userRef;
        firebase.firestore().collection('users').where("email", "==", sessionStorage.getItem('userAccountEmail')).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userRef = doc.id
            })
            firebase.firestore().collection('users').doc(userRef).update({
                user_ratings: firebase.firestore.FieldValue.arrayUnion(this.state.setUserRating)
            })
        })
    }

    handleClose = (event) => {
        this.setState({hiddenRateUser: false})
    }

    setRatingValue = (event) => {
        this.setState({setUserRating: event.target.value})
    }

    render(){
        return(
            <div>
                <AppBar position = "static" style={{background:'#c5050c'}}>
                    <Toolbar>
                        <IconButton onClick={this.toggleMenu}> 
                        <MenuIcon/>
                        </IconButton>
                        <Box style={{flexGrow: 1}} hidden={this.state.searchActive}>
                        <Typography variant="h3">
                            <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger-Textbooks
                        </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <NavigationMenu/>
                </Drawer>

                <Grid>
                    <Grid item style={{margin:'auto', padding:'20px'}}>
                        <img onError={this.addDefaultSrc} className="img-responsive"
                            src={this.state.userAccountImage} width="150" height="150" alt="" style={{backgroundColor: "#dadfe1"}}/>
                    </Grid>
                    <Grid item>
                        <Typography style={{fontSize: '50px'}}>
                            {this.state.userAccountName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box component="fieldset" mb={3} borderColor="transparent">
                            <Rating name="read-only" value={this.state.userAccountRating} readOnly />
                        </Box>
                    </Grid>
                    <Button title='rateUser_btn' type="submit" onClick={this.rateUser} style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '40%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Rate {this.state.userAccountName}</Button>
                    <Button title='reportUser_btn' type="submit" onClick={this.rateUser} style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '40%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Report {this.state.userAccountName}</Button>
                </Grid>   

                <Dialog open={this.state.hiddenRateUser}>
                    <DialogTitle >{"Rate User"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Rate Your Experience With This User
                    </DialogContentText>
                        <Rating name='simple-controlled' onChange={this.setRatingValue} value={this.state.setUserRating}></Rating>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.sendUserRating} color="primary">
                        Send
                    </Button>
                    <Button title='close_btn' onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

export default UserAccount