/*Create MyListings UI
 1. Create Listing
    Provide input boxes for users to provide information such as book title, author, ISBN, price wanted, condition of book, etc.
    Send all of that data to the database.
    Dependencies: ability to input all possible information about the book they are listing, user must have been able to login
 2. Display Listings
    Provide a list of all of the user’s listings.
    Dependencies: Firebase must return a collection of listing documents for the specific user
 */

import 'firebase/firestore';
import React, {useState} from 'react';
import ListingItem from "./ListingItem";

function MyListings() {
    // const [newListings, setNewListings] = useState({
    //     []}
    //     []});
    const [items, setListings] = useState([
        {   seller: "badger",
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
            condition: "brand-new"
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
    ]);

    return (
        <div>
            <button className="edit-button"> Create new Listings</button>
            <div className="grid-container">
                <div className={"item_listing"}>
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
            </div>
        </div>

    );
}

export default MyListings;
