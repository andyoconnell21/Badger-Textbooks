import { Done } from '@material-ui/icons';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Login from './Login'

describe("Render content onto page", () =>{
    test("Render LoginPage Text", () => {
        render(<Login />);
        const headerText = screen.getByText("Welcome to Badger Textbooks")
        const signInText = screen.getByText("Sign In")
        expect(headerText).toBeInTheDocument();
        expect(signInText).toBeInTheDocument();
      })
})

afterEach(cleanup)
