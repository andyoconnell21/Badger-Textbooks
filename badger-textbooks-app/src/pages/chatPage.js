import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React from "react";
import {
    AppBar,
    Box,
    Button,
    Card,
    Container,
    Grid,
    IconButton,
    Paper,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import BackIcon from '@material-ui/icons/ArrowBackIos';

const lightGrey = '#eeeeee';
const backgroundBeige = '#d2b48c';
const badgerRed = '#c5050c';
  
class Chat extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        messages: [],
        senderName: "",
        senderUid: "",
        receiverName: "",
        currentText: ""
    }
  }

  //LIFECYCLE FUNCTION: Does basic page setup, check user auth, makes call to display initial messages.
  componentDidMount() {
    document.body.style.backgroundColor = backgroundBeige;
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        //User is not siged in...redirect to login page
        window.location.href = "/";
      } else {
        console.log(user.uid);
        this.setState({ senderUid: user.uid });
        this.updateDisplayedMessages();
        
        firebase.firestore().collection("users").where("uid", "==", user.uid).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.setState({ senderName: doc.data().name });
          });
        });
        firebase.firestore().collection("users").where("uid", "==", sessionStorage.getItem("receiverUid")).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({ receiverName: doc.data().name });
            });
        });
      }
    }.bind(this));
  }

  //FUNCTION: Updates state as the user makes changes to the chat box.
  updateText = (event) => {
    this.setState({ currentText: event.target.value });
  }

  //FUNCTION: Adds the current entered message to firebase and clears the chat box.
  handleMessageSend = (event) => {
    firebase.firestore().collection('messages').add({
        sender: this.state.senderName,
        sender_uid: this.state.senderUid,
        receiver: this.state.receiverName,
        receiver_uid: sessionStorage.getItem('receiverUid'),
        text: this.state.currentText,
        date: Date().toLocaleString()
    }).catch(function (error) {
        console.error('Error writing new message to database', error);
    }).then(() => {
        this.setState({currentText: ""});
        this.updateDisplayedMessages();
    });
  }
    onKeyPress = (e) => {
        if (e.which === 13) {
            this.handleMessageSend();
        }
    }

    //FUNCTION: Gets all relevant messages (sent and recieved) and sorts them by date before placing them in state for display.
    updateDisplayedMessages() {
        var tempMessages = [];
        firebase.firestore().collection("messages")
            .where("sender_uid", "==", this.state.senderUid)
            .where("receiver_uid", '==', sessionStorage.getItem('receiverUid'))
            .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var gather = doc.data();
            tempMessages.push(gather)
        });
        firebase.firestore().collection("messages")
          .where("sender_uid", "==", sessionStorage.getItem('receiverUid'))
          .where("receiver_uid", "==", this.state.senderUid)
          .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var gather = doc.data();
                tempMessages.push(gather);
            })
            tempMessages.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.date) - new Date(b.date);
            }); 
            this.setState({ messages: tempMessages });
        });
    });
  }

  render() {
    return (
        <div>
            <AppBar style={{ background: badgerRed }} position="static">
              <Toolbar>
                <IconButton 
                  title="back_btn" 
                  style={{ zIndex: 1, marginTop: '15px', marginBottom: '15px' }}
                  onClick={() => { window.location.assign(sessionStorage.getItem("returnLocation")); }}
                >
                  <BackIcon />
                </IconButton>
                <Typography style={{position: 'absolute', fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', left: 0, right: 0}}>
                  Conversation with {this.state.receiverName}
                </Typography>
              </Toolbar>
            </AppBar>

            <Container>
                <Box style={{height: '100vh'}}>
                    <Paper variant="outlined" square style={{ height: '100%' }}>
                        {this.state.messages.map((item) => (
                            <Card fullWidth style={{ margin: "10px", backgroundColor: lightGrey }}>
                                <Typography align="left" style={{ margin: '5px' }}>
                                    {item.sender}: {item.text}
                                </Typography>
                            </Card>
                        ))}
                    </Paper>
                </Box>
            </Container>

            <AppBar position='fixed' style={{ background: badgerRed, bottom: 0, top: 'auto'}}>
                <Toolbar>
                    <Container>
                      <Grid container>
                        <Grid item xs={11}>
                          <Box style={{flexGrow: 1, marginTop: '15px', marginBottom: '15px'}}>
                            <Card>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your message here..."
                                    variant='outlined'
                                    value={this.state.currentText}
                                    onChange={this.updateText}
                                    onKeyPress={this.onKeyPress}
                                />
                            </Card>
                          </Box>
                        </Grid>
                        <Grid item xs={1} style={{paddingTop: '15px', paddingBottom: '15px'}}>
                          <Button
                            style={{height: '100%'}}
                            variant="contained"
                            onClick={this.handleMessageSend}
                            endIcon={<SendIcon/>}
                          >
                            Send
                          </Button>
                        </Grid>
                      </Grid>
                    </Container>
                </Toolbar>
            </AppBar>    
        </div>
    );
  }
}

export default Chat;