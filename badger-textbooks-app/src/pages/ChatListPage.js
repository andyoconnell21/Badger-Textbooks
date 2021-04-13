import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';

import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MenuIcon from '@material-ui/icons/Menu';

const nameIndex = 0;
const nameUidIndex = 1;
const chatIndex = 2;

class ChatList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chats: [],
            userUid: "",
            menuOpen: false,
            tempRecentChat: ""
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
                this.setState({userUid: user.uid});
                var tempData = [];
                firebase.firestore().collection("messages")
                  .where("sender_uid", "==", user.uid)
                  .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var name = doc.data().receiver;
                        var name_uid = doc.data().receiver_uid;
                        var time = doc.data().date;
                        tempData.push({name: name, name_uid: name_uid, time: time});
                    });
                    firebase.firestore().collection("messages")
                      .where("receiver_uid", "==", user.uid)
                      .get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            var name = doc.data().sender;
                            var name_uid = doc.data().sender_uid;
                            var time = doc.data().date;
                            tempData.push({name: name, name_uid: name_uid, time: time});
                        });
                        tempData.sort(function(a,b){
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return new Date(b.time) - new Date(a.time);
                        });
                        var interData = []
                        tempData.forEach((item) => {
                            interData.push({name: item.name, name_uid: item.name_uid});
                        });
                        var filteredPeople = [];
                        interData.forEach(function(item){
                            var i = filteredPeople.findIndex(x => x.name === item.name);
                            if(i <= -1){
                                filteredPeople.push({name: item.name, name_uid: item.name_uid});
                            }
                        });
                        filteredPeople.forEach((person) => {
                            this.getMostRecentMessage(person.name, person.name_uid);
                        });
                    });
                });
            }
        }.bind(this));
    }

    //HELPER FUNCTION: Handles the toggling of the menu.
    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
          menuOpen: !curr_state
        });
    }

    //HELPER FUNCTION: Gets the most recent message for each chat to display.
    getMostRecentMessage = (name, name_uid) => {
        var chats = this.state.chats;
        var tempMessages = [];
        firebase.firestore().collection("messages")
        .where("sender_uid", "==", this.state.userUid)
        .where("receiver_uid", '==', name_uid)
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              var gather = doc.data();
              tempMessages.push(gather)
          });
          firebase.firestore().collection("messages")
            .where("sender_uid", "==", name_uid)
            .where("receiver_uid", "==", this.state.userUid)
            .get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  var gather = doc.data();
                  tempMessages.push(gather);
              });
              tempMessages.sort(function(a,b) {
                  // Turn your strings into dates, and then subtract them
                  // to get a value that is either negative, positive, or zero.
                  return new Date(b.date) - new Date(a.date);
              });
              chats.push([name, name_uid, tempMessages[0].text]);
              this.setState({chats: chats});
            });
        });
    }

    render() {
        return (
            <div>
                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <NavigationMenu/>
                </Drawer>

                <AppBar position='static' style ={{ background: '#c5050c' }}>
                    <Toolbar>
                        <Box hidden={this.state.searchActive}>
                            <IconButton title="menu_btn" onClick={this.toggleMenu}> 
                                <MenuIcon/>
                            </IconButton>
                        </Box>
                        <Typography variant="h4" style={{ flexGrow: 1 }}>
                            My Conversations
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Box style={{height: '100vh'}}>
                        <Paper variant="outlined" square style={{ height: '100%' }}>
                            <List>
                                {this.state.chats.map((data) => (
                                    <div>
                                        <ListItem 
                                            button 
                                            onClick={() => {
                                                sessionStorage.setItem("receiverUid", data[nameUidIndex]);
                                                sessionStorage.setItem("returnLocation", "/chatlist")
                                                window.location.assign("/chat");
                                            }}
                                        >
                                            <ListItemText primary={data[nameIndex]} secondary={data[chatIndex]} />
                                            <ListItemIcon><NavigateNextIcon/></ListItemIcon>
                                        </ListItem>
                                        <Divider/>
                                    </div>
                                ))}
                            </List>
                        </Paper>
                    </Box>
                </Container>
            </div>
        )
    };
}

export default ChatList;