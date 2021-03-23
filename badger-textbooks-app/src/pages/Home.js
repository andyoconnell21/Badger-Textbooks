import firebase from 'firebase/app';
import 'firebase/firestore';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const IDIndex = 0;
const dataIndex = 1;

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      listings: [],
      searchValue: "",
      searchFilter: "title",
      searchResults: []
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
  
  updateSearchFilter = (event) => {
    this.setState({
      searchFilter: event.target.value
    });
  }

  updateSearchValue = (event) => {
    this.setState({
      searchValue: event.target.value
    });
  }

  clearSearchValue = (event) => {
    this.setState({
      searchValue: ""
    });
  }

  initSearch = (event) => {
    var tempResults = []
    firebase.firestore().collection("listings").where(this.state.searchFilter, "==", this.state.searchValue).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          var gather = [doc.id, doc.data()]
          tempResults.push(gather)
      });
      this.setState({
          searchResults: tempResults
      });
    });
  }
  
  render() {
    return (
      <div>
          <InputLabel id="filter-select-label">Search By...</InputLabel>
          <Select
            style={{width: "25%"}}
            labelId="filter-select-label"
            value={this.state.searchFilter}
            onChange={this.updateSearchFilter}
          >
            <MenuItem value={"title"}>Title</MenuItem>
            <MenuItem value={"author"}>Author</MenuItem>
            <MenuItem value={"class"}>Class</MenuItem>
          </Select>
          <InputBase
            style={{width: "50%"}}
            placeholder="Search…"
            value={this.state.searchValue}
            onChange={this.updateSearchValue}
          />
          <IconButton
            onClick={this.clearSearchValue}
          > 
            <ClearIcon/>
          </IconButton>
          <IconButton
            onClick={this.initSearch}
          > 
            <SearchIcon/>
          </IconButton>

          <Divider/>

          <Container maxWidth='lg'>
            <Typography variant='h3'>Search Results</Typography>
            <Card>
              {this.state.searchResults.map((item) => (
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