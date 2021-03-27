import { render, screen } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';
import Login from './Login'
import CreateAccount from './pages/CreateAccount';

describe("Testing Home-Page", () => {
  test('basic render test', () => {
    render(<Home/>)
  })

  test('home page renders text', () => {
    render (<Home/>)
    expect(/Recent Listings/i).toBeInTheDocument();
    expect(/Search Listings By.../i).toBeInTheDocument();
  })

describe("Render Testing of Login Page", () =>{
  test("Basic Render Test of Login Page", () => {
    render(<Login />);
  })
  test("Render LoginPage Text", () => {
      render(<Login />);
      const headerText = screen.getByText("Welcome to Badger Textbooks")
      const signInText = screen.getByText("Sign In")
      expect(headerText).toBeInTheDocument();
      expect(signInText).toBeInTheDocument();
    })
})

describe("Render Testing of Create Account Page", () =>{
  test("Basic Render Test of Create Account Page", () => {
    render(<CreateAccount />)
  })

  test("Render CreateAccount Page Text", () => {
    render(<CreateAccount />)
    const headerText = screen.getByText("Welcome to Badger Textbooks")
    const createAccountText = screen.getByText("Create An Account")
    expect(headerText).toBeInTheDocument();
    expect(createAccountText).toBeInTheDocument();
  })
})
 
});
