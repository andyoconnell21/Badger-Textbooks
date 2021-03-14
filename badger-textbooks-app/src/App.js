import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyATKX78GgcgavgsRD0eUozsDAVQ1zpaEEs",
  authDomain: "badgertextbooks-2919f.firebaseapp.com",
  projectId: "badgertextbooks-2919f",
  storageBucket: "badgertextbooks-2919f.appspot.com",
  messagingSenderId: "83634428792",
  appId: "1:83634428792:web:8e85dff9a5ddaa76b1868d",
  measurementId: "G-TGR6BX114K"
};

var fire = firebase.initializeApp(firebaseConfig);

class App extends React.Component {
  render() {
    return (
        <div>
            <p>
                Test text for landing page.
            </p>
        </div>
    );
  }
}

////DEFAULT CODE////
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
