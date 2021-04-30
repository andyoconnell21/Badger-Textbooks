import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import Logo from '../BadgerTextbooksLogoV1.png';
import emailjs from 'emailjs-com';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const backgroundGrey = '#dadfe1';
const badgerRed = '#c5050c';

const idIndex = 0;
const dataIndex = 1;

class UserAccount extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userAccountEmail: '',
            userAccountName: '',
            userAccountImage: '',
            hiddenRateUser: false,
            setUserRating: 0,
            userAccountRating: 0,
            hiddenReportUser: false,
            reportText: '',
            emailSent: false,
            ratingSaved: false,
            userListingsArray: [],
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                //User is not siged in...redirect to login page
                window.location.href = "/";
            } else{
                var this_user_uid = '';
                //Get relevant information of that user
                firebase.firestore().collection('users').where("email", "==", sessionStorage.getItem('userAccountEmail')).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.setState({
                            userAccountName: doc.data().name
                        })
                        this_user_uid = doc.data().uid;
                        var tempUserRating = 0;
                        for(var i = 0; i < doc.data().user_ratings.length; i++){
                            var tempValue = parseInt(doc.data().user_ratings[i])
                            tempUserRating = tempUserRating + tempValue
                        }
                        tempUserRating = tempUserRating / doc.data().user_ratings.length
                        tempUserRating = parseFloat(tempUserRating.toFixed(1))
                        this.setState({userAccountRating: tempUserRating})

                        //Get some of the users current listings
                        firebase.firestore().collection("users").where("uid", "==", this_user_uid).get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                var userListingsRef = doc.data().listings
                                var tempUserListingArray = []
                                var userListingArray = [];
                                for(let i = 0; i < userListingsRef.length; i++){
                                    tempUserListingArray.push(userListingsRef[i].id)
                                }
                                firebase.firestore().collection('listings').where('active', '==', true).get().then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        for(let i = 0; i < tempUserListingArray.length; i++){
                                            if(tempUserListingArray[i] === doc.id && userListingArray.length !== 3){
                                                var gather = [doc.id, doc.data()]
                                                userListingArray.push(gather)
                                            }
                                        }
                                        this.setState({userListingsArray: userListingArray})
                                    })
                                })
                            })
                        })
                    })
                })
            }
        });
        this.setState({userAccountEmail: sessionStorage.getItem('userAccountEmail')})
        document.body.style.backgroundColor = backgroundGrey;

    }

    addDefaultPfp(ev) {
        ev.target.src = "https://firebasestorage.googleapis.com/v0/b/badgertextbooks-2919f.appspot.com/o/userAccountImage.png?alt=media&token=91c14802-542d-4723-8c55-405b7552c8fa"
    }

    addDefaultSrc(ev) {
        ev.target.src = "https://badgerchemistnews.chem.wisc.edu/wp-content/themes/uw-theme/dist/images/bucky-head.png"
    }

    rateUser = (event) => {
        this.setState({hiddenRateUser: true})
    }

    reportUser = (event) => {
        this.setState({hiddenReportUser: true})
    }

    setReportText = (event) => {
        this.setState({reportText: event.target.value})
    }

    sendUserRating = (event) => {
        //Capture the rating and store it in firebase

        var userRef;
        firebase.firestore().collection('users').where("email", "==", sessionStorage.getItem('userAccountEmail')).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userRef = doc.id
            })
            var tempVal = parseInt(this.state.setUserRating)
            firebase.firestore().collection('users').doc(userRef).update({
                user_ratings: firebase.firestore.FieldValue.arrayUnion(tempVal)
            })
        })
        this.setState({
            ratingSaved: true,
            hiddenRateUser: false,
        })
    }

    handleClose = (event) => {
        this.setState({
            hiddenRateUser: false,
            hiddenReportUser: false,
            emailSent: false,
            ratingSaved: false
        })
    }

    setRatingValue = (event) => {
        this.setState({setUserRating: event.target.value})
    }

    sendUserReport = (event) => {
        var templateParams = {
            reportedUser: this.state.userAccountName,
            message: this.state.reportText
        }

        emailjs.send(
            'service_1gpwrm8',
            'template_wf9i0jv',
            templateParams,
            'user_Q1uufiN3C4uLWwSwg37S6'
        ).then((response) => {
            console.log('SUCCESS', response.status, response.text)
            this.setState({
                emailSent: true,
                hiddenReportUser: false,
            })
        }, function(error){
            console.log("FAILED", error)
        })
    }

    toggleBackButton = (event) => {
        window.location.assign("/listing");
    }

    render(){
        return(
            <div>
                <AppBar style={{ background: badgerRed }} position="static">
                    <Toolbar>
                        <IconButton title="back_btn" onClick={this.toggleBackButton} style={{ zIndex: 1, marginTop: '15px', marginBottom: '15px' }}>
                            <ArrowBackIosIcon/>
                        </IconButton>
                        <Typography style={{position: 'absolute', fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', left: 0, right: 0}}>
                            <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger Textbooks
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Grid>
                    <Grid item style={{margin:'auto', padding:'20px'}}>
                        <img onError={this.addDefaultPfp} className="img-responsive"
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
                            <Typography>
                                ({this.state.userAccountRating}/5)
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" style={{fontFamily:'sans-serif'}}>
                            Here are some of {this.state.userAccountName}'s current listings
                        </Typography>
                    </Grid>

                    <Grid container spacing={3} justify='center' style={{ marginTop: "10px" }}>
                        {this.state.userListingsArray.map((item) => (
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
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Button title='rateUser_btn' type="submit" onClick={this.rateUser} style={{marginTop: "30px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '40%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Rate {this.state.userAccountName}</Button>
                    <Button title='reportUser_btn' type="submit" onClick={this.reportUser} style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '40%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Report {this.state.userAccountName}</Button>
                </Grid>

                <Dialog open={this.state.hiddenRateUser}>
                    <DialogTitle >{"Rate User"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Rate Your Experience With This User
                        </DialogContentText>
                        <Rating name='simple-controlled' data-testid="rating" onChange={this.setRatingValue} value={this.state.setUserRating}></Rating>
                    </DialogContent>
                    <DialogActions>
                        <Button title='send_rate_btn' onClick={this.sendUserRating} color="primary">
                            Send
                        </Button>
                        <Button title='close_rate_btn' onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.hiddenReportUser}>
                    <DialogTitle >{"Report User"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Report Your Experience With This User
                        </DialogContentText>
                        <TextField
                            data-testid="report_text"
                            type="text"
                            onChange={this.setReportText}>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button title='send_report_btn' onClick={this.sendUserReport} color="primary">
                            Send
                        </Button>
                        <Button title='close_report_btn' onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.emailSent}>
                    <DialogTitle >{"Email Sent"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your report has been recorded! We will contact you for further details!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button title='close_email_report_btn' onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.ratingSaved}>
                    <DialogTitle >{"Email Sent"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your rating has been submitted! Thank you for rating our users!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button title='close_report_confirm_btn' onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

export default UserAccount