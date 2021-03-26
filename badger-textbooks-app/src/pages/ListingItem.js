/*Create MyListings UI
 1. Create Listing
    Provide input boxes for users to provide information such as book title, author, ISBN, price wanted, condition of book, etc.
    Send all of that data to the database.
    Dependencies: ability to input all possible information about the book they are listing, user must have been able to login
 2. Display Listings
    Provide a list of all of the user’s listings.
    Dependencies: Firebase must return a collection of listing documents for the specific user
 */

import React from 'react';
//import {Button, Card} from "react-bootstrap"
// import "../Box.css";
import * as MyListings from "@firebase/util";

// function ListingItem({seller, image, title, author, ISBN, desired_price, condition}) {
//     return (
//         <div className="box">
//             <grid>
//                 <img src={image} alt="" className="item-image"></img>
//                 <h3>Book Title: {title}</h3>
//                 <h3>Author: {author}</h3>
//                 <h3>ISBN: {ISBN}</h3>
//                 <h3>Asking Price: {desired_price * 1.00}</h3>
//                 <h3>Book Condition: {condition}</h3>
//                 <button> Check it out</button>
//                 <button> Add to favorite</button>
//             </grid>
//         </div>
//     );
// }

function ListingItem({seller, image, title, author, ISBN, desired_price, condition}) {
    return (
        <grid>
        {/* <Card style={{width: '18rem'}} >
            <Card.Img variant="top" src={image} className="item-image"/>
            <Card.Body>
                <Card.Text><b>Book name:</b> {title}</Card.Text>
                <Card.Text><b>Author: </b>{author}</Card.Text>
                <Card.Text><b>ISBN:</b>{ISBN}</Card.Text>
                <Card.Text><b>Desired Price:</b> {desired_price}</Card.Text>
                <Card.Text><b>Condition: </b>{condition}</Card.Text>
                <Button className='check-it-button'>Check it Out!</Button>
            </Card.Body>
        </Card> */}
        </grid>
    );
}


export default ListingItem;
