import React, {Component} from 'react';
import '../w3.css'
import '../App.css'
import firebase from "firebase";
import {Button} from "@material-ui/core";

//book title, author, ISBN, price wanted, condition of book, class_used
export class CreateNewListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            ISBN: 0,
            price: 0,
            condition: 'brand-new',
            class_used: '',
        }
    }
    handleSubmit = (e) => {
        alert(`${this.state.title} ${this.state.author}`)
        e.preventDefault()

    }
    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    handleAuthorChange = (e) => {
        this.setState({
            author: e.target.value
        })
    }
    handleISBNChange = (e) => {
        this.setState({
            ISBN: e.target.value
        })
    }
    handlePriceChange = (e) => {
        this.setState({
            price: e.target.value
        })
    }
    handleClassChange = (e) => {
        this.setState({
            class_used: e.target.value
        })
    }
    handleConditionChange = (e) => {
        this.setState({
            condition: e.target.value
        })
    }
    backToListing = (event) => {
        window.location.href = '/mylistings'
    }

    addListingItem = (event) => {
        firebase.firestore().collection('listings').doc().set({
                title: this.state.title,
                author: this.state.author,
                ISBN: this.state.ISBN,
                price: this.state.price,
                condition: this.state.condition,
                class_used: this.state.class_used,
        })
        this.componentDidMount();
    };
    componentDidMount(){
        var tempListingData = [];
        firebase.firestore().collection("listings").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var gather = [doc.id, doc.data(), false]
                tempListingData.push(gather)
            });
            this.setState({
                listings: tempListingData
            });
        });

    }



    render() {
        const {title, author, ISBN, price, condition, class_used} = this.state
        return (
            <form onSubmit={this.handleSubmit} className="form-box" style={{fontFamily: 'sans-serif',fontSize: '16px'}}>
                <Button style={{border: '0',fontFamily: 'sans-serif', backgroundColor: 'lightgrey', cursor: 'pointer', color: 'white', fontSize: '18px'}}>Return</Button>
                <div>
                    <h1 className="w3-container w3-red">Create a New Listing</h1>
                    <label><b>Book Title: </b> </label>
                    <input className="w3-input w3-hover-light-gray"
                           type='text'
                           size="sm"
                           value={title}
                           onChange={this.handleTitleChange}
                    />
                </div>
                <div>
                    <label><b>Author: </b> </label>
                    <input className="w3-input w3-hover-light-gray"
                           size="sm"
                           type='text'
                           value={author}
                           onChange={this.handleAuthorChange}
                    />
                </div>
                <div>
                    <label>ISBN: </label>
                    <input className="w3-input w3-hover-light-gray"
                           type='text'
                           value={ISBN}
                           pattern="[0-9]+"
                           onChange={this.handleISBNChange}
                    />
                </div>

                <div>
                    <label>Desired Price: </label>
                    <input className="w3-input w3-hover-light-gray"
                           type='number'
                           value={price}
                           onChange={this.handlePriceChange}
                    />
                </div>
                <div>
                    <label>Class Required: </label>
                    <input className="w3-input w3-hover-light-gray"
                           type='text'
                           value={class_used}
                           onChange={this.handleClassChange}
                    />
                </div>
                <div>
                    <label>Condition: </label>
                    <select className="w3-input w3-hover-light-gray"
                            value={condition}
                            onChange={this.handleConditionChange}>
                        <option value='Brand-new'>Brand new</option>
                        <option value='Like-New'>Like New</option>
                        <option value='Good'>Good</option>
                        <option value='Fair'>Fair</option>
                        <option value='Poor'>Poor, but still usable</option>
                    </select>
                </div>
                <Button type="submit" style={{marginTop: "10px", marginBottom: '10px', border: '0', backgroundColor: '#c5050c', width: '50%', marginRight: '25%',
                    marginLeft: '25%', cursor: 'pointer', color: 'white', fontSize: '18px'}} onSubmit={this.addListingItem}>Create!</Button>

            </form>

    )
    }

}
export default CreateNewListing;
