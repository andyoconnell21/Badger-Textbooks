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

function ListingItem({seller, image, title, author, ISBN, desired_price, condition}) {
    return (
        <div className="box">
            <img src={image} alt=""></img>
            <h3>Book Title: {title}</h3>
            <h3>Author: {author}</h3>
            <h3>ISBN: {ISBN}</h3>
            <h3>Asking Price: {desired_price}</h3>
            <h3>Book Condition: {condition}</h3>
            <button> Check it out</button>
        </div>
    );


}

export default ListingItem;
