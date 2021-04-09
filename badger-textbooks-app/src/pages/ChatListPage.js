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

class ChatList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chats: [],
            userEmail: "",
            menuOpen: false
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
                this.setState({userEmail: user.email})
                var tempData = [];
                firebase.firestore().collection("test_messages")
                  .where("sender", "==", user.email)
                  .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var name = doc.data().receiver;
                        var time = doc.data().date;
                        tempData.push({name: name, time: time});
                    });
                    firebase.firestore().collection("test_messages")
                      .where("receiver", "==", user.email)
                      .get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            var name = doc.data().sender;
                            var time = doc.data().date;
                            tempData.push({name: name, time: time});
                        })
                        tempData.sort(function(a,b){
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return new Date(b.time) - new Date(a.time);
                        });
                        var interData = []
                        tempData.forEach((item) => {
                            interData.push(item.name)
                        });
                        var filteredData = interData.filter((c, index) => {
                            return interData.indexOf(c) === index;
                        });
                        this.setState({ chats: filteredData });
                    });
                });
            }
        }.bind(this));
    }

    toggleMenu = (event) => {
        var curr_state = this.state.menuOpen;
        this.setState({
          menuOpen: !curr_state
        });
    }

    //TRYING TO GET MOST RECENT MESSAGE TO DISPLAY BELOW CHAT NAMES...DOESN'T WORK YET
    // getMostRecentMessage(name) {
    //     var tempMessages = [];
    //     firebase.firestore().collection("test_messages")
    //     .where("sender", "==", this.state.userEmail)
    //     .where("receiver", '==', name)
    //     .get().then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //           var gather = doc.data();
    //           tempMessages.push(gather)
    //       });
    //       firebase.firestore().collection("test_messages")
    //         .where("sender", "==", name)
    //         .where("receiver", "==", this.state.userEmail)
    //         .get().then((querySnapshot) => {
    //           querySnapshot.forEach((doc) => {
    //               var gather = doc.data();
    //               tempMessages.push(gather);
    //           });
    //           tempMessages.sort(function(a,b) {
    //               // Turn your strings into dates, and then subtract them
    //               // to get a value that is either negative, positive, or zero.
    //               return new Date(a.date) - new Date(b.date);
    //           }); 
    //         //   tempMessages.reduce(function(a, b) {
    //         //     return new Date(a.date) > new Date(b.date) ? a : b;
    //         //   });
    //         });
    //     });
        
    //     return tempMessages[0].text;
    // }

    render() {
        return (
            <div>
                <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
                    <NavigationMenu/>
                </Drawer>

                <AppBar position='static'>
                    <Toolbar>
                        <Box hidden={this.state.searchActive}>
                            <IconButton title="menu_btn" onClick={this.toggleMenu}> 
                                <MenuIcon/>
                            </IconButton>
                        </Box>
                        <Typography variant="h4">
                            My Conversations
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Box style={{height: '100vh'}}>
                        <Paper variant="outlined" square style={{ height: '100%' }}>
                            <List>
                                {this.state.chats.map((name) => (
                                    <div>
                                        <ListItem 
                                            button 
                                            onClick={() => {
                                                sessionStorage.setItem("receiverEmail", name);
                                                sessionStorage.setItem("returnLocation", "/chatlistpage")
                                                window.location.assign("/chatpage");
                                            }}
                                        >
                                            <ListItemText primary={name} secondary="Placeholder for most recent message." />
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