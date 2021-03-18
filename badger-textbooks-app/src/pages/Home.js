import firebase from 'firebase/app';
import 'firebase/firestore';

import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

const idIndex = 0;
const dataIndex = 1;

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      listings: []
    }
  }

  componentDidMount () {
      document.body.style.backgroundColor = '#f7d154';

      var tempListings = []
      firebase.firestore().collection("listings").orderBy("time_created").limit(10).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              var gather = [doc.id, doc.data()]
              tempListings.push(gather)
          });
          this.setState({
              listings: tempListings
          });
      });
  }
  
  render() {
    return (
      <div>
        <Container maxWidth='lg'>
            <Typography variant='h3'>Recent Listings</Typography>
            <Card>
              {this.state.listings.map((item) => (
                <Grid container spacing="2" style={{margin: "10px"}}>
                  <Grid item xs>
                      Title: {item[dataIndex].title}
                  </Grid>
                  <Grid item xs>
                      Author: {item[dataIndex].author}
                  </Grid>
                  <Grid item xs>
                      Price: ${item[dataIndex].price}
                  </Grid>
                  <Grid item xs>
                      Seller: {item[dataIndex].owner}
                  </Grid>
                  <Grid item xs>
                      UW-Madison Class Used For: {item[dataIndex].class}
                  </Grid>
                </Grid>
              ))}
            </Card>
        </Container>
      </div>
    );
  }
}

export default Home;