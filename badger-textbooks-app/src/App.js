import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.min.css';
import CreateAccount from "./pages/CreateAccount"
import Home from "./pages/Home"
import Login from "./Login"
import Listing from "./pages/Listing"
import React from "react";
import MyListings from "./pages/MyListings";
import CreateNewListing from "./pages/CreateNewListings";
import TestChatPage from "./pages/testChatPage";

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

//for chat system
// firebase.database().ref("messages").on("child_removed", function (snapshot) {
//   document.getElementById("message-" + snapshot.key).innerHTML = "This message has been deleted";
// });

// function deleteMessage(self) {
//   var messageId = self.getAttribute("data-id");
//   firebase.database().ref("messages").child(messageId).remove();
// }

// function sendMessage() {
//   var message = document.getElementById("message").value;
//   firebase.database().ref("messages").push().set({
//     "message": message,
//     "sender": myName
//   });
//   return false;
// }

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
              <Route path="/chatPage" exact component={() => <chatPage/>} />
              <Route path="/testChatPage" exact component={() => <TestChatPage/>}/>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;