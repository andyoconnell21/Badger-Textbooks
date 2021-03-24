import React, {Component} from 'react';
import '../w3.css'
import '../App.css'
import firebase from "firebase";

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

    addListingItem = (event) => {
        event.preventDefault();
        const db = firebase.firestore();
        db.settings({
            timestampsInSnapshots: true
        });
        const userRef = db.collection('listings').add({
            title: this.state.title,
            author: this.state.author,
            ISBN: this.state.ISBN,
            price: this.state.price,
            condition: this.state.condition,
            class_used: this.state.class_used,
        });
        this.setState({
            title: '',
            author: '',
            ISBN: 0,
            price: 0,
            condition: 'brand-new',
            class_used: '',
        });
    };
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

    render() {
        const {title, author, ISBN, price, condition, class_used} = this.state
        return (
            <form onSubmit={this.handleSubmit} className="form-box">
                <div>
                    <h1 className="w3-container w3-red">Create a New Listing</h1>
                    <label>Book Title: </label>
                    <input className="w3-input w3-hover-light-gray"
                           type='text'
                           size="sm"
                           value={title}
                           onChange={this.handleTitleChange}
                    />
                </div>
                <div>
                    <label>Author: </label>
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
                <button type="submit" className="w3-btn w3-red" onSubmit={this.addListingItem}>Create!</button>
            </form>
        )
    }

}
export default CreateNewListing;
