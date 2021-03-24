import React from "react";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {
  Button,
  AppBar,
  Typography,
  } from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

class Listings extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          author: '',
          class: '',
          owner: '',
          price: '',
          date: new Date(),
          title: '',
          condition: '',
          image: '',
        }
    }

    componentDidMount () {
      var documentId = sessionStorage.getItem('currentListing')

      firebase.firestore().collection("listings").doc(documentId).get()
        .then((doc) => {
          var data = doc.data();
          this.setState({
            author: data.author,
            class: data.class,
            owner: data.owner,
            price: data.price,
            date: data.time_created.toDate(),
            title: data.title,
            condition: data.condition,
            image: data.image_url
          })
        })
    }

    //Implement message system
    contactSeller = (event) => {
      
    }
  
  render() {
   return (
      <div>
        <AppBar position = "static" style={{background:'#c5050c'}}>
          <Typography variant='h6' style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '25px', margin: '25px', textAlign: 'center'}}>
            Listing of {this.state.title} Textbook
          </Typography>
        </AppBar>

        <h2>Title: {this.state.title}</h2>
        <h3>Author: {this.state.author}</h3>
        <h3>Class: {this.state.class}</h3>
        <h3>Condition: {this.state.condition}</h3>
        <h3>Price: ${this.state.price}</h3>
        <img src={this.state.image} alt="textbook" style={{marginBottom: "15px", width:'20%'}}/>
        <Accordion style={{width: "25%", margin: 'auto'}}>
          <AccordionSummary style={{backgroundColor: 'lightgrey'}}>
            <Typography style={{fontFamily: 'sans-serif', fontSize:'14px', fontWeight: 'bold', margin:'auto'}}>Other Information</Typography>
          </AccordionSummary>
          <AccordionDetails style={{flexDirection: 'column'}}>
            <Typography>
              <b>Seller of Textbook:</b> {this.state.owner}
            </Typography>
            <Typography>
              <b>Date of Listing:</b> {this.state.date.toString()}
            </Typography>
            <Typography>
              <b>Rating of Seller:</b> 5 Star
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Button onClick={this.contactSeller} style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '25%', marginRight: '25%', marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Contact Seller</Button>
      </div>
     )
  }
}

export default Listings

