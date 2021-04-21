import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React from "react";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import HomeIcon from '@material-ui/icons/Home';
import AdminIcon from '@material-ui/icons/SupervisorAccount';

class NavigationMenu extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pageName: window.location.pathname,
            adminDisplay: "none"
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(function(user) {
            firebase.firestore().collection('users').where('uid', '==', user.uid).get().then((querySnapshot) => {
                var isAdmin = false;
                querySnapshot.forEach((doc) => {
                    isAdmin = doc.data().isAdmin;
                });
                if (isAdmin) {
                    this.setState({ adminDisplay: 'flex' });
                }
            });
        }.bind(this));
    }

    handleClick(page) {
        window.location.assign(page);
    }

    render() {
        return (
            <div>
                <List>
                    <ListItem key="header">
                        <ListItemText primary="Menu" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="home_nav" title="home_nav_btn" selected={this.state.pageName === "/home"} onClick={() => this.handleClick("/home")}>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="create_listing_nav" title="crea_nav_btn" selected={this.state.pageName === "/createnewlisting"} onClick={() => this.handleClick("/createnewlisting")}>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary="Create a New Listing" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="my_listings_nav" title="list_nav_btn" selected={this.state.pageName === "/mylistings"} onClick={() => this.handleClick("/mylistings")}>
                        <ListItemIcon><MyListingsIcon/></ListItemIcon>
                        <ListItemText primary="My Listings" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="saved_listings_nav" selected={this.state.pageName === "/savedListings"} onClick={() => this.handleClick("/savedListings")}>
                        <ListItemIcon><SavedIcon/></ListItemIcon>
                        <ListItemText primary="Saved Listings" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="chat_list_nav" title="chat_nav_btn" selected={this.state.pageName === "/chatlist"} onClick={() => this.handleClick("/chatlist")}>
                        <ListItemIcon><ChatIcon/></ListItemIcon>
                        <ListItemText primary="My Conversations" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="admin_nav"
                              style={{display: this.state.adminDisplay}}
                              selected={this.state.pageName === "/admin"}
                              onClick={() => this.handleClick("/admin")}
                    >
                        <ListItemIcon><AdminIcon/></ListItemIcon>
                        <ListItemText primary="Manage Reports" />
                    </ListItem>
                    <Divider style={{display: this.state.adminDisplay}}/>
                    <ListItem button key="account_nav" selected={this.state.pageName === "/myAccount"} onClick={() => this.handleClick("/myAccount")}>
                        <ListItemIcon><AccountIcon/></ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>
                    <Divider/>
                </List>
            </div>
        )
    };
}

export default NavigationMenu;
