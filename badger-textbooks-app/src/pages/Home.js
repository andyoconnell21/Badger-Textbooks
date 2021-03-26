import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { withStyles } from '@material-ui/core/styles';
import React from "react";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import CardMedia from '@material-ui/core/CardMedia';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import { fade } from '@material-ui/core/styles/colorManipulator';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MyListingsIcon from '@material-ui/icons/ListAlt';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SavedIcon from '@material-ui/icons/Favorite';

const idIndex = 0;
const dataIndex = 1;

const styles = theme => ({
  root: {
  width: "100%",
  minWidth: 1080
  },
  menu: {
  marginTop: 15,
  marginBottom: 15,
  display: 'flex',
  justifyContent: 'center'
  },
  paper: {
  marginLeft: 18,
  marginRight: 18
  },
  progress: {
  margin: theme.spacing.unit * 2
  },
  grow: {
  flexGrow: 1,
  },
  menuButton: {
  marginLeft: -12,
  marginRight: 20,
  },
  title: {
  display: 'none',
  [theme.breakpoints.up('sm')]: {
  display: 'block',
  },
  },
  search: {
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: fade(theme.palette.common.white, 0.15),
  '&:hover': {
  backgroundColor: fade(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
  marginLeft: theme.spacing.unit,
  width: 'auto',
  },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    },
  inputRoot: {
  color: 'inherit',
  width: '50%',
  },
  inputInput: {
  paddingTop: theme.spacing.unit,
  paddingRight: theme.spacing.unit,
  paddingBottom: theme.spacing.unit,
  paddingLeft: theme.spacing.unit * 10,
  transition: theme.transitions.create('width'),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
  width: 120,
  '&:focus': {
  width: 200,
  },
  },
  }
  });
  
class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      listings: [],
      searchValue: "",
      searchFilter: "title",
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
    firebase.firestore().collection("listings").where(this.state.searchFilter, "==", this.state.searchValue).get().then((querySnapshot) => {
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
    const { classes } = this.props;

    return (
      <div>
        <AppBar style ={{ background:'#c5050c' }} position="static">
          <Toolbar>
            <IconButton onClick={this.toggleMenu}> 
              <MenuIcon/>
            </IconButton>
            <Typography style={{marginInline: "10px"}}>Search Listings By...</Typography>
            <Select
              style={{width: "10%", marginInline: "10px", background: "#ed666a"}}
              labelId="filter-select-label"
              variant="outlined"
              value={this.state.searchFilter}
              onChange={this.updateSearchFilter}
            >
              <MenuItem value={"title"}>Title</MenuItem>
              <MenuItem value={"author"}>Author</MenuItem>
              <MenuItem value={"class"}>Class</MenuItem>
            </Select>
            <Card style={{width: "50%"}}>
              <TextField
                placeholder="Search..."
                variant='outlined'
                fullWidth
                value={this.state.searchValue}
                onChange={this.updateSearchValue}
              />
            </Card>
            <IconButton onClick={this.clearSearchValue}> 
              <ClearIcon/>
            </IconButton>
            <IconButton onClick={this.initSearch}> 
              <SearchIcon />
            </IconButton>
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

        <Container maxWidth='lg'>
          <Typography variant='h3' hidden={this.state.searchHidden} style={{ margin: "10px"}}>Search Results</Typography>
          <Card>
            {this.state.searchResults.map((item) => (
              <div>
                <Grid container spacing="3" style={{margin: "10px"}}>
                  <Grid item xs>
                    <CardMedia>
                      <img src={item[dataIndex].image_url} alt="Cover Unavailable" width="50" height="60"/>
                    </CardMedia>
                  </Grid>
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
                  <Grid item xs >
                    <Button style = {{backgroundColor: '#c5050c'}} onClick={() => {
                      sessionStorage.setItem('currentListing', item[idIndex]);
                      console.log(sessionStorage.getItem('currentListing'));
                      window.location.href = "/listing";
                    }}>
                      Details 
                    </Button>
                  </Grid>
                </Grid>
                <Divider/>
              </div>
            ))}
          </Card>

          <Typography variant='h3' style={{ margin: "10px"}}>Recent Listings</Typography>
          <Card>
            {this.state.listings.map((item) => (
              <div>
                <Grid container spacing= "3" style={{margin: "10px"}}>
                  <Grid item xs>
                    <img src={item[dataIndex].image_url} width="50" height="60" alt="Textbook Cover"/>
                  </Grid>
                  <Grid item xs >
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
                  <Grid item xs >
                    <Button style = {{backgroundColor: '#c5050c'}} onClick={() => {
                      sessionStorage.setItem('currentListing', item[idIndex]);
                      console.log(sessionStorage.getItem('currentListing'));
                      window.location.href = "/listing";
                    }}>
                      Details 
                    </Button>
                  </Grid>
                </Grid>
                <Divider/>
              </div>
            ))}
          </Card>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Home);