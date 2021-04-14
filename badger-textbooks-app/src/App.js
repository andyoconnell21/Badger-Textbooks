import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateAccount from "./pages/CreateAccount"
import Home from "./pages/Home"
import Login from "./Login"
import Listing from "./pages/Listing"
import React from "react";
import MyListings from "./pages/MyListings";
import CreateNewListing from "./pages/CreateNewListings";
import Chat from "./pages/chatPage";
import ChatListPage from "./pages/ChatListPage";
import EditListingPage from "./pages/EditListing";
import MyAccountPage from "./pages/MyAccountPage";
import SavedListings from './pages/SavedListings';
import UserAccount from './pages/UserAccount';
import AdminPage from './pages/AdminPage';

const firebaseConfig = {
  apiKey: "AIzaSyATKX78GgcgavgsRD0eUozsDAVQ1zpaEEs",
  authDomain: "badgertextbooks-2919f.firebaseapp.com",
  projectId: "badgertextbooks-2919f",
  storageBucket: "badgertextbooks-2919f.appspot.com",
  messagingSenderId: "83634428792",
  appId: "1:83634428792:web:8e85dff9a5ddaa76b1868d",
  measurementId: "G-TGR6BX114K"
};

var fire = firebase.initializeApp(firebaseConfig);

class App extends React.Component {

  render() {
    return (
        <div className="App">
          <Router>
            <Switch>
              <Route path="/" exact component={() => <Login />}/>
              <Route path="/createaccount" exact component={() => <CreateAccount />}/>
              <Route path="/home" exact component={() => <Home />} />
              <Route path="/listing" exact component={() => <Listing />}/>
              <Route path="/mylistings" exact component={() => <MyListings/>} />
              <Route path="/createnewlisting" exact component={() => <CreateNewListing/>} />
              <Route path="/chat" exact component={() => <Chat/>}/>
              <Route path="/chatlist" exact component={() => <ChatListPage/>}/>
              <Route path="/editlisting" exact component={() => <EditListingPage/>}/>
              <Route path="/myAccount" exact component={() => <MyAccountPage/>}/>
              <Route path="/savedListings" exact component={() => <SavedListings/>}/>
              <Route path='/userAccount' exact component={() => <UserAccount/>}/>
              <Route path="/admin" exact component={() => <AdminPage/>}/>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
