/*Create MyListings UI
 1. Create Listing
    Provide input boxes for users to provide information such as book title, author, ISBN, price wanted, condition of book, etc.
    Send all of that data to the database.
    Dependencies: ability to input all possible information about the book they are listing, user must have been able to login
 2. Display Listings
    Provide a list of all of the user’s listings.
    Dependencies: Firebase must return a collection of listing documents for the specific user
 */
//
import React, {useState, useEffect} from 'react';
import 'firebase/firestore';
import firebase from 'firebase/app';
import ListingItem from "./ListingItem";
import history from '../history';
import {Button, Nav, NavItem, Navbar, NavLink} from 'react-bootstrap';
// import {Button} from "@material-ui/core";
import * as listings from "@firebase/util";
//
// class MyListings extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             title: "A Game of Thrones Leather-Cloth Boxed Set",
//             image: "https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/F01/352/46/F013524602.jpg&v=5dc43dc7&w=348&h=348",
//             author: 'George R. R. Martin',
//             ISBN: 9781101965481,
//             desired_price: 60.00,
//             condition:'brand-new',
//             class_used: 'lit 312'
//         }
//     }
//
//     // key: 0,
//     // seller: '';
//     // image: '';
//     // title: '',
//     // author: '',
//     // ISBN: '',
//     // desired_price: 0,
//     // condition: 'brand-new'
//
//
//     componentDidMount() {
//         document.body.style.backgroundColor = '#494949'
//
//         //Adds current listing items to an array
//         var tempListingItems = [];
//
//         firebase.firestore().collection("listings").get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 var gather = [doc.id, doc.data(), false]
//                 tempListingItems.push(gather)
//             });
//             this.setState({
//                 listings: tempListingItems
//             });
//         });
//
//     }
//
//     render() {
//         return (
//                 <div className="item_listing">
//                     <h1>{listings}></h1>
//
//
//                 </div>
//         )
//     }
// }
// export default MyListings

//     <ListingItem key={item.seller}
//         seller={item.seller}
//         image={item.image}
//         title={item.title}
//         author={item.author}
//         ISBN={item.ISBN}
//         desired_price={item.desired_price}
//         condition={item.condition}
//     />
// ))}
//
//
//
// // const db = firebase.firestore();
// // let goToCreate = (event) => {
// //     window.location.href = '/createnewlistings'
// // }
function MyListings() {


    const [items, setListings] = useState([
            {
                seller: "badger",
                image: "https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/F01/352/46/F013524602.jpg&v=5dc43dc7&w=348&h=348",
                title: "A Game of Thrones Leather-Cloth Boxed Set",
                author: 'George R. R. Martin',
                ISBN: 9781101965481,
                desired_price: 60.00,
                condition: "brand-new"
            },
            {
                seller: "badger",
                image: "https://smartbaroda.com/wp-content/uploads/2020/05/Harry-Potter-book-set-2.jpg",
                title: "Harry Potter Book Set",
                author: 'JK Rowling',
                ISBN: 9780545010221,
                desired_price: 30.00,
                condition: "brand-new",
            },
            {
                seller: "badger",
                image: "https://1.bp.blogspot.com/-vK3WLD_h-9Y/XU7USszN0OI/AAAAAAAAKFE/_4d_HtEktjkhqOZXZl31k_4YGDBxBnWlQCEwYBhgL/s400/thumbnail_20190805_085314.jpg",
                title: "Codename Villanelle",
                author: 'Luke Jennings',
                ISBN: 9781473666412,
                desired_price: 7.00,
                condition: "brand-new"
            },
            {
                seller: "badger",
                image: "https://i5.walmartimages.com/asr/d1425bba-18c3-45b1-871f-6fc06e0ff6b7_1.d59864698b8bc44a8ffcccabf2d05d40.jpeg?odnWidth=1000&odnHeight=1000&odnBg=ffffff",
                title: "The Tattooist of Auschwitz",
                author: 'Heather Morris',
                ISBN: 9781760403171,
                desired_price: 5.00,
                condition: "brand-new"
            },
        ]
    );
// class MyListings extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             title: '',
//             author: '',
//             ISBN: 0,
//             price: 0,
//             condition:'brand-new',
//             class_used: '',
//         }
//         this.handleLogout = this.handleLogout.bind(this);
//     }

    // fetchListings = async() => {
    //     const response=db.collection('listings');
    //     const data=await response.get();
    //

    // handleLogout() {
    //     firebase.auth().signOut().then(() => {
    //         //Sign-out successful.
    //     }).catch((error) => {
    //         //An error happened.
    //     });
    //     window.location.href = '/'
    // }
    //
    // render() {
    return (
//             <div>
//             {/*    <Navbar>*/}
//             {/*        <Navbar.Header>*/}
//             {/*            <a href="/">BadgerTextbooks</a>*/}
//             {/*        </Navbar.Header>*/}
//             {/*        <Navbar.Body>*/}
//             {/*            <Nav>*/}
//             {/*                <NavItem>*/}
//             {/*                    <NavLink href="/home">Home</NavLink>*/}
//             {/*            </NavItem>*/}
//             {/*            <NavItem>*/}
//             {/*                <NavLink href="/mylistings">MyListings</NavLink>*/}
//             {/*            </NavItem>*/}
//             {/*            <Nav.Item>*/}
//             {/*                <button onClick={this.handleLogout}>Logout</button>*/}
//             {/*            </Nav.Item>*/}
//             {/*        </Nav>*/}
//             {/*    </Navbar.Body>*/}
//             {/*</Navbar>*/}
        <div>
            <div className="item_listing">
                {items.map(item => (
                    <ListingItem key={item.seller}
                                 seller={item.seller}
                                 image={item.image}
                                 title={item.title}
                                 author={item.author}
                                 ISBN={item.ISBN}
                                 desired_price={item.desired_price}
                                 condition={item.condition}
                    />
                ))}
            </div>
            <button className="add-button"> Create new Listings</button>
        </div>


    );

}

export default MyListings

