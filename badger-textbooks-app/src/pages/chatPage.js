import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {
  Button,
  TextField,
  Grid,
  AppBar,
  Typography,
  Link,
  Container,
  } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from "react";


class chatPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            $messages = $('.messages-content'),
            d, h, m,
            i = 0,
            myName = "",
        }
      }
  render(){
      return(
    <div>
        <div class="chat">
        <div class="chat-title">
        <h1>Chat Room</h1>
        <h2>Firebase</h2>
        <figure class="avatar">
          <img src="https://p7.hiclipart.com/preview/349/273/275/livechat-online-chat-computer-icons-chat-room-web-chat-others.jpg" /></figure>
        </div>
        <div class="messages">
        <div class="messages-content"></div>
        </div>
        <div class="message-box">
        <textarea type="text" class="message-input" id="message" placeholder="Type message..."></textarea>
        <button type="submit" class="message-submit">Send</button>
        </div>
    
        </div>
        <div class="bg"></div>

        <div class="footer fixed-bottom">
        Get an image sharing web app in Node JS and Mongo DB for just <b>$20</b>. <a style="color: greenyellow;" href="https://adnan-tech.com/image-sharing-app-in-node-js/">Get here</a>
        </div>
    </div>
      );
  }
  
}export default ChatPage
