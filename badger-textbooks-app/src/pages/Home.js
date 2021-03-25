import firebase from 'firebase/app';
import 'firebase/firestore';
import { withStyles } from '@material-ui/core/styles';
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
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MenuIcon from "@material-ui/icons/Menu";
import { fade } from '@material-ui/core/styles/colorManipulator';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import GotoIcon from '@material-ui/icons/NavigateNext';

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
      searchResults: []
    }
  }

  componentDidMount () {
    document.body.style.backgroundColor = '#ffffff';

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
    const { classes } = this.props;

    return (
      <div>
        <AppBar style ={{ background: '#FF3333' }} position="static">
        <Toolbar>
        <Select
            style={{width: "15%"}}
            labelId="filter-select-label"
            value={this.state.searchFilter}
            onChange={this.updateSearchFilter}
          >
             <MenuItem value={"title"}>Title</MenuItem>
            <MenuItem value={"author"}>Author</MenuItem>
            <MenuItem value={"class"}>Class</MenuItem>
          </Select>

          <InputBase
            placeholder="Search"
            classes={{
             root: classes.inputRoot,
             input: classes.inputInput,
              }}
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
            <div className={classes.searchIcon}>
            <SearchIcon />
            </div>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Divider/>
          <Container maxWidth='lg'>
            <Typography variant='h3'>Search Results</Typography>
            {this.state.searchResults.map((item) => (
              <Grid container spacing="2" style={{margin: "10px"}}>
                <Grid item xs>
                  <CardMedia>
                    <img src={item[dataIndex].image_url} alt="Textbook Cover" width="2" height="3"/>
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
                <Grid item xs>
                    UW-Madison Class Used For: {item[dataIndex].class}
                </Grid>
              </Grid>
            ))}

            <Typography variant='h4'>Recent Listings</Typography>
              {this.state.listings.map((item) => (
                <Grid container spacing= "3" style={{margin: "10px"}}>
                  <Grid item xs>
                    <Box width="25%" height="25%">
                      <img src={item[dataIndex].image_url} alt="Textbook Cover"/>
                    </Box>  
                  </Grid>
                  <Grid item xs >
                      Title: {item[dataIndex].title}
                  </Grid>
                  <Grid item xs>
                      Author: {item[dataIndex].author}
                  </Grid>
                  <Grid item xs>
                      Price: {item[dataIndex].price}
                  </Grid>
                  <Grid item xs>
                      Seller: {item[dataIndex].owner}
                  </Grid>
                  <Grid item xs >
                      UW-Madison Class Used For: {item[dataIndex].class}
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
              ))}
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Home);