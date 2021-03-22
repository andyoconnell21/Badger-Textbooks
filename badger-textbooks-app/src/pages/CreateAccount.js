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

import React from "react";

class CreateAccount extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        return(
            <div>
                <h2>Testing Page</h2>
            </div>
        )
    }
}

export default CreateAccount  