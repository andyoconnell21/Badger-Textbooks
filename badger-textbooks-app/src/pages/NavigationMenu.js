import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import AddIcon from '@material-ui/icons/Add';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import HomeIcon from '@material-ui/icons/Home';

class NavigationMenu extends React.Component { 

    constructor(props) {
        super(props)
        this.state = {
            pageName: window.location.pathname
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(page) {
        window.location.assign(page);
    }

    render() {
        return (
            <div>
                <List>
                    <ListItem key="header">
                        <ListItemText primary="Navigation Menu"/>
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
                    <ListItem button key="chat_list_nav" title="chat_nav_btn" selected={this.state.pageName === "/chatlist"} onClick={() => this.handleClick("/chatlist")}>
                        <ListItemIcon><ChatIcon/></ListItemIcon>
                        <ListItemText primary="My Conversations" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="saved_listings_nav" disabled>
                        <ListItemIcon><SavedIcon/></ListItemIcon>
                        <ListItemText primary="Saved Listings" />
                    </ListItem>
                    <Divider/>
                    <ListItem button key="account_nav" selected={this.state.pageName === "/myAccount"} onClick={() => this.handleClick("/myAccount")}>
                        <ListItemIcon><AccountIcon/></ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>
                </List>
            </div>
        )
    };
}

export default NavigationMenu;