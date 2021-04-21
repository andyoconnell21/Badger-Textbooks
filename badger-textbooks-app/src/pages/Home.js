import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import NavigationMenu from './NavigationMenu';
import Logo from '../BadgerTextbooksLogoV1.png';

import React from "react";
import {
  Grid,
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Drawer
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBackIos';

const idIndex = 0;
const dataIndex = 1;
const white = '#ffffff';
const backgroundBeige = '#d2b48c';
const badgerRed = '#c5050c';
  
class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      listings: [],
      searchActive: false,
      defaultDisplay: 'block',
      searchDisplay: 'none',
      searchValue: "",
      searchFilter: "search_title",
      searchResults: [],
      searchHidden: true,
      menuOpen: false,
    }
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        //User is not siged in...redirect to login page
        window.location.href = "/";
      }
    });

    document.body.style.backgroundColor = backgroundBeige;

    var tempListings = []
    firebase.firestore().collection("listings").where("active", "==", true).limit(10).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var gather = [doc.id, doc.data()]
            tempListings.push(gather)
        });
        tempListings.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b[dataIndex].time_created) - new Date(a[dataIndex].time_created);
        }); 
        this.setState({
            listings: tempListings
        });
    });
  }

  toggleMenu = (event) => {
    var curr_state = this.state.menuOpen;
    this.setState({
      menuOpen: !curr_state
    });
  }

  toggleActiveSearch = (event) => {
    var curr_state = this.state.searchActive;
    if (curr_state) {
      this.setState({
        searchActive: !curr_state,
        defaultDisplay: 'block',
        searchDisplay: 'none',
        searchValue: "",
        searchResults: []
      });
    } else {
      this.setState({
        searchActive: !curr_state,
        defaultDisplay: 'none',
        searchDisplay: 'block',
        searchValue: "",
        searchResults: []
      });
    }
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
      searchValue: "",
      searchResults: [],
      searchHidden: true
    });
  }

  initSearch = (event) => {
    var tempResults = []
    firebase.firestore().collection("listings").where(this.state.searchFilter, "==", this.state.searchValue.toLowerCase()).where("active", "==", true)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          var gather = [doc.id, doc.data()]
          tempResults.push(gather)
      });
      tempResults.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b[dataIndex].time_created) - new Date(a[dataIndex].time_created);
      }); 
      this.setState({
          searchResults: tempResults,
          searchHidden: false
      });
    });
  }

  addDefaultSrc(ev) {
    ev.target.src = "https://badgerchemistnews.chem.wisc.edu/wp-content/themes/uw-theme/dist/images/bucky-head.png"
  }

  render() {
    return (
      <div>
        <AppBar style ={{ background: badgerRed }} position="static">
          <Toolbar>

            <Box hidden={this.state.searchActive}>
              <IconButton title="menu_btn" onClick={this.toggleMenu}> 
                <MenuIcon/>
              </IconButton>
            </Box>

            <Box style={{flexGrow: 1}} hidden={this.state.searchActive}>
              <Typography style={{flexGrow: 1, fontFamily: 'sans-serif', fontSize: '35px', margin: '15px', textAlign: 'center'}}>
                <img src={Logo} style={{height: '50px', width: '50px'}} alt=""/> Badger Textbooks
              </Typography>
            </Box>

            <Box hidden={this.state.searchActive}>
              <IconButton title="search_btn" onClick={this.toggleActiveSearch}> 
                <SearchIcon/>
              </IconButton>
            </Box>

            <Box hidden={!this.state.searchActive}>
              <IconButton title="back_btn" onClick={this.toggleActiveSearch}> 
                <BackIcon/>
              </IconButton>
            </Box>

            <Box hidden={!this.state.searchActive} style={{marginRight: "10px", margin: '15px', width: "10%"}}>
              <FormControl style={{width: '100%'}}>
                <InputLabel id="filter-select-label" style={{marginLeft: "2px", color: white}}>Search by...</InputLabel>
                <Select
                  labelId="filter-select-label"
                  data-testid="filter_slct"
                  style={{width: "100%", color: white}}
                  variant="outlined"
                  value={this.state.searchFilter}
                  onChange={this.updateSearchFilter}
                >
                  <MenuItem value={"search_title"}>Title</MenuItem>
                  <MenuItem value={"search_author"}>Author</MenuItem>
                  <MenuItem value={"class"}>Class</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box hidden={!this.state.searchActive} style={{flexGrow: 1}}>
              <Card>
                <TextField
                  data-testid="search_input"
                  placeholder="Search listings..."
                  variant='outlined'
                  fullWidth
                  value={this.state.searchValue}
                  onChange={this.updateSearchValue}
                />
              </Card>
            </Box>

            <Box hidden={!this.state.searchActive} style={{ marginLeft: '10px', marginRight: '10px' }}>
              <IconButton title="clear_btn" onClick={this.clearSearchValue}> 
                <ClearIcon/>
              </IconButton>
            </Box>

            <Box hidden={!this.state.searchActive}>
              <IconButton title="execute_btn" onClick={this.initSearch} hidden={true}> 
                <SearchIcon />
              </IconButton>
            </Box>

          </Toolbar>
        </AppBar>

        <Drawer title="nav_menu" anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
          <NavigationMenu/>
        </Drawer>

        <Box style={{display: this.state.searchDisplay, margin:'20px'}}>
          <Typography variant='h4' color="textSecondary" style={{ margin: "10px"}}>
            Results ({this.state.searchResults.length})
          </Typography>
          <Grid container spacing={3} justify='center' style={{ marginTop: "10px" }}>
            {this.state.searchResults.map((item) => (
              <Grid item>
                <Card style={{width: "300px"}}>
                  <CardContent>
                    <Grid container>
                      <Grid item>
                        <img src={item[dataIndex].image_url} width="50" height="60" alt="" style={{backgroundColor: "#eeeeee"}}/>
                      </Grid>
                      <Grid item xs >
                        <div style={{overflow: 'auto', textOverflow: "ellipsis", height: '4rem'}}> 
                          <Typography variant='h6'>
                            {item[dataIndex].title}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                    <Grid container>
                      <Grid item xs>
                        <Typography color="textSecondary" style={{}}>
                          Price:
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography color="textSecondary">
                          ${item[dataIndex].price}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs>
                        <Typography color="textSecondary">
                          Seller:
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography color="textSecondary">
                          {item[dataIndex].seller_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                
                  <CardActions>
                    <Button fullWidth style = {{backgroundColor: badgerRed, color: white}} onClick={() => {
                      sessionStorage.setItem('currentListing', item[idIndex]);
                      window.location.href = "/listing";
                    }}>
                      See Details 
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box style={{display: this.state.defaultDisplay, margin:'20px'}}>
          <Typography variant='h4' style={{ margin: "10px" }}>
            Check out these recent listings...
          </Typography>
          <Grid container spacing={3} justify='center' style={{ marginTop: "10px" }}>
            {this.state.listings.map((item) => (
              <Grid item>
                <Card style={{width: "300px"}}>
                  <CardContent>
                    <Grid container style={{height: '60px'}}>
                      <Grid item>
                        <img onError={this.addDefaultSrc} className="img-responsive"
                             src={item[dataIndex].image_url} width="50" height="60" alt="" style={{backgroundColor: "#eeeeee"}}/>
                      </Grid>
                      <Grid item xs>
                        <div style={{overflow: 'auto', textOverflow: "ellipsis", height: '4rem'}}> 
                          <Typography variant='h6'>
                            {item[dataIndex].title}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                    <Grid container>
                      <Grid item xs>
                        <Typography color="textSecondary" style={{left: 0}}>
                          Price:
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography color="textSecondary">
                          ${item[dataIndex].price}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs>
                        <Typography color="textSecondary">
                          Seller:
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography color="textSecondary">
                          {item[dataIndex].seller_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                
                  <CardActions>
                    <Button fullWidth style = {{backgroundColor: badgerRed, color: white}} onClick={() => {
                      sessionStorage.setItem('currentListing', item[idIndex]);
                      window.location.href = "/listing";
                    }}>
                      See Details 
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    );
  }
}

export default Home;