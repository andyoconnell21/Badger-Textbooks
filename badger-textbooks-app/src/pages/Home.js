import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';
import BackIcon from '@material-ui/icons/ArrowBackIos';

const idIndex = 0;
const dataIndex = 1;
  
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
      menuOpen: false
    }
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        //User is not siged in...redirect to login page
        window.location.href = "/";
      }
    }); 

    document.body.style.backgroundColor = '#d2b48c';

    var tempListings = []
    firebase.firestore().collection("listings").orderBy("time_created", "desc").limit(10).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var gather = [doc.id, doc.data()]
            tempListings.push(gather)
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
        searchDisplay: 'none'
      });
    } else {
      this.setState({
        searchActive: !curr_state,
        defaultDisplay: 'none',
        searchDisplay: 'block'
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
    firebase.firestore().collection("listings").where(this.state.searchFilter, "==", this.state.searchValue.toLowerCase()).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          var gather = [doc.id, doc.data()]
          tempResults.push(gather)
      });
      this.setState({
          searchResults: tempResults,
          searchHidden: false
      });
    });
  }

  render() {
    return (
      <div>
        <AppBar style ={{ background:'#c5050c' }} position="static">
          <Toolbar>
            <Box hidden={this.state.searchActive}>
              <IconButton onClick={this.toggleMenu}> 
                <MenuIcon/>
              </IconButton>
            </Box>

            <Box style={{flexGrow: 1}} hidden={this.state.searchActive}>
              <Typography variant="h3" fullWidth>
                Badger-Textbooks
              </Typography>
            </Box>

            <Box hidden={this.state.searchActive}>
              <IconButton onClick={this.toggleActiveSearch}> 
                <SearchIcon/>
              </IconButton>
            </Box>

            <Box hidden={!this.state.searchActive}>
              <IconButton onClick={this.toggleActiveSearch}> 
                <BackIcon/>
              </IconButton>
            </Box>

            <Box hidden={!this.state.searchActive} style={{marginRight: "10px", width: "10%"}}>
              <FormControl style={{width: '100%'}}>
                <InputLabel id="filter-select-label" style={{marginLeft: "2px"}}>Search by...</InputLabel>
                <Select
                  style={{width: "100%"}}
                  labelId="filter-select-label"
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
              <Card fullWidth>
                <TextField
                  placeholder="Search..."
                  variant='outlined'
                  fullWidth
                  value={this.state.searchValue}
                  onChange={this.updateSearchValue}
                />
              </Card>
            </Box>

            <Box hidden={!this.state.searchActive}>
              <IconButton onClick={this.clearSearchValue}> 
                <ClearIcon/>
              </IconButton>
            </Box>

            <Box hidden={!this.state.searchActive}>
              <IconButton onClick={this.initSearch} hidden={true}> 
                <SearchIcon />
              </IconButton>
            </Box>

          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={this.state.menuOpen} onClose={this.toggleMenu}>
          <List>
              <ListItem button key="create_listing_nav" onClick={() => {window.location.href = "/createnewlisting";}}>
                <ListItemIcon><AddIcon/></ListItemIcon>
                <ListItemText primary="Create a New Listing" />
              </ListItem>
              <Divider/>
              <ListItem button key="my_listings_nav" onClick={() => {window.location.href = "/mylistings";}}>
                <ListItemIcon><MyListingsIcon/></ListItemIcon>
                <ListItemText primary="My Listings" />
              </ListItem>
              <Divider/>
              <ListItem button key="saved_listings_nav" disabled>
                <ListItemIcon><SavedIcon/></ListItemIcon>
                <ListItemText primary="Saved Listings" />
              </ListItem>
              <Divider/>
              <ListItem button key="account_nav" disabled>
                <ListItemIcon><AccountIcon/></ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
          </List>
        </Drawer>

        <Box style={{display: this.state.searchDisplay, margin:'20px'}}>
          <Typography variant='h4' color="textSecondary" style={{ margin: "10px"}}>
            Results ({this.state.searchResults.length})
          </Typography>
          <Grid container spacing="3">
            {this.state.searchResults.map((item) => (
              <Grid item>
                <Card style={{width: "300px"}}>
                  <CardContent>
                    <Grid container>
                      <Grid item>
                        <img src={item[dataIndex].image_url} width="50" height="60" alt="Textbook Cover"/>
                      </Grid>
                      <Grid item xs >
                        <Typography variant='h6'>
                          {item[dataIndex].title}
                        </Typography>
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
                          {item[dataIndex].owner}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                
                  <CardActions>
                    <Button fullWidth style = {{backgroundColor: '#c5050c', color: '#ffffff'}} onClick={() => {
                      sessionStorage.setItem('currentListing', item[idIndex]);
                      console.log(sessionStorage.getItem('currentListing'));
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
          <Typography variant='h4' style={{ margin: "10px"}}>
            Check out these recent listings...
          </Typography>
          <Grid container spacing="3">
            {this.state.listings.map((item) => (
              <Grid item>
                <Card style={{width: "300px"}}>
                  <CardContent>
                    <Grid container>
                      <Grid item>
                        <img src={item[dataIndex].image_url} width="50" height="60" alt="Textbook Cover"/>
                      </Grid>
                      <Grid item xs >
                        <Typography variant='h6'>
                          {item[dataIndex].title}
                        </Typography>
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
                          {item[dataIndex].owner}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                
                  <CardActions>
                    <Button fullWidth style = {{backgroundColor: '#c5050c', color: '#ffffff'}} onClick={() => {
                      sessionStorage.setItem('currentListing', item[idIndex]);
                      console.log(sessionStorage.getItem('currentListing'));
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