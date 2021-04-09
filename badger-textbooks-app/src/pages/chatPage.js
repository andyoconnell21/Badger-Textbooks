import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import SendIcon from '@material-ui/icons/Send';
import BackIcon from '@material-ui/icons/ArrowBackIos';
  
class Chat extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        messages: [],
        senderEmail: "",
        currentText: ""
    }
  }

  //LIFECYCLE FUNCTION: Does basic page setup, check user auth, makes call to display initial messages.
  componentDidMount() {
    document.body.style.backgroundColor = '#d2b48c';
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        //User is not siged in...redirect to login page
        window.location.href = "/";
      } else {
        this.setState({ senderEmail: user.email });
        this.updateDisplayedMessages();
      }
    }.bind(this));
  }

  //FUNCTION: Updates state as the user makes changes to the chat box.
  updateText = (event) => {
    this.setState({ currentText: event.target.value });
  }

  //FUNCTION: Adds the current entered message to firebase and clears the chat box.
  handleMessageSend = (event) => {
    firebase.firestore().collection('test_messages').add({
        sender: this.state.senderEmail,
        receiver: sessionStorage.getItem('receiverEmail'),
        text: this.state.currentText,
        date: Date().toLocaleString()
    }).catch(function(error) {
        console.error('Error writing new message to database', error);
    }).then(() => {
        this.setState({ currentText: "" });
        this.updateDisplayedMessages();
    });
  }

  //FUNCTION: Gets all relevant messages (sent and recieved) and sorts them by date before placing them in state for display.
  updateDisplayedMessages() {
    var tempMessages = [];
    firebase.firestore().collection("test_messages")
      .where("sender", "==", this.state.senderEmail)
      .where("receiver", '==', sessionStorage.getItem('receiverEmail'))
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var gather = doc.data();
            tempMessages.push(gather)
        });
        firebase.firestore().collection("test_messages")
          .where("sender", "==", sessionStorage.getItem('receiverEmail'))
          .where("receiver", "==", this.state.senderEmail)
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
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        onClick={() => { window.location.href = sessionStorage.getItem("returnLocation"); }}
                    >
                        <BackIcon/>
                    </IconButton>
                    <Typography variant="h4">
                        Conversation with {sessionStorage.getItem('receiverEmail')}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container>
                <Box style={{height: '100vh'}}>
                    <Paper variant="outlined" square style={{ height: '100%' }}>
                        {this.state.messages.map((item) => (
                            <Card fullWidth style={{ margin: "10px", backgroundColor: "#eeeeee" }}>
                                <Typography align="left" style={{ margin: '5px' }}>
                                    {item.sender}: {item.text}
                                </Typography>
                            </Card>
                        ))}
                    </Paper>
                </Box>
            </Container>

            <AppBar position='fixed' style={{ bottom: 0, top: 'auto'}}>
                <Toolbar>
                    <Box style={{flexGrow: 1, marginRight: '10px'}}>
                    <Card>
                        <TextField
                            fullWidth
                            placeholder="Enter your message here..."
                            variant='outlined'
                            value={this.state.currentText}
                            onChange={this.updateText}
                        />
                    </Card>
                    </Box>
                    <Button
                        style = {{height: '100%'}}
                        variant="contained"
                        onClick={this.handleMessageSend}
                        endIcon={<SendIcon/>}
                    >
                        Send
                    </Button>
                </Toolbar>
            </AppBar>    
        </div>
    );
  }
}

export default Chat;