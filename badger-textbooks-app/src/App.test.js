import { render, screen, fireEvent } from '@testing-library/react';
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
    const headerText = screen.getByText("Badger-Textbooks")
    expect(headerText).toBeInTheDocument();
  })

  test("click menu button", () => {
    const { queryByTitle } = render(<Home/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Navigation Menu");

    expect(navigation_text).toBeInTheDocument();
  })

  test("switch to search mode", () => {
    const { queryByTitle } = render(<Home/>);
    const search_btn = queryByTitle("search_btn");
    fireEvent.click(search_btn);
    const back_btn = queryByTitle("back_btn");

    expect(back_btn).toBeInTheDocument();
  })

  test("switch back from search mode", () => {
    const { queryByTitle } = render(<Home/>);
    const search_btn = queryByTitle("search_btn");
    fireEvent.click(search_btn);
    const back_btn = queryByTitle("back_btn");
    fireEvent.click(back_btn);

    expect(search_btn).toBeInTheDocument();
  })

  test("update search filter", () => {
    const { queryByTitle, getByTestId } = render(<Home/>);
    const search_btn = queryByTitle("search_btn");
    fireEvent.click(search_btn);

    const filter_slct = getByTestId('filter_slct').querySelector('input');
    expect(screen.getByText("Title")).toBeInTheDocument();
    fireEvent.change(filter_slct, {
      target: { value: "search_author" },
    });
    expect(screen.getByText("Author")).toBeInTheDocument();
  })

  //CURRENTLY FAILING
  // test("update search value", () => {
  //   const { queryByTitle, getByTestId } = render(<Home/>);
  //   const search_btn = queryByTitle("search_btn");
  //   fireEvent.click(search_btn);

  //   const field = getByTestId('search_input').querySelector('input');
  //   fireEvent.change(field, { target: { value: "test" } });

  //   const execute_btn = queryByTitle("execute_btn");
  //   fireEvent.click(execute_btn);
    
  //   expect(screen.getByText("Results(\n0\n)")).toBeInTheDocument();
  // })


});

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
});

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
});
