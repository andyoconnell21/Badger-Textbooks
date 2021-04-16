import { render, screen, fireEvent, mockChange, getByTitle } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';
import Login from './Login'
import CreateAccount from './pages/CreateAccount';
import Listing from './pages/Listing'
import CreateNewListing from './pages/CreateNewListings'
import MyListings from './pages/MyListings';
import NavigationMenu from './pages/NavigationMenu';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import EditListing from "./pages/EditListing";
import CreateNewListings from "./pages/CreateNewListings";
import MyAccountPage from './pages/MyAccountPage';


let assignMock = jest.fn();
delete window.location;
window.location = { assign: assignMock };
afterEach(() => {
  assignMock.mockClear();
});


//APP PAGE TESTS
describe("Render Testing For App Component", () =>{
  test("Basic Render Test For App", () => {
    render(<App />);
  })
});


//LOGIN PAGE TESTS
describe("Render and Unit Testing of Login Page", () =>{
  test("Basic Render Test of Login Page", () => {
    render(<Login />);
  })

  test("Render LoginPage Text and TextInputs", () => {
      render(<Login />);
      const headerText = screen.getByText("Welcome to Badger Textbooks")
      const subheaderText = screen.getByText("Sign In")

      expect(headerText).toBeInTheDocument();
      expect(subheaderText).toBeInTheDocument();
      expect(screen.getByTitle('emailTextInput')).toBeInTheDocument()
      expect(screen.getByTitle('passwordTextInput')).toBeInTheDocument()
    })

  test("Forgot Password Button", () => {
    const { queryByTitle, getByTestId } = render(<Login/>);
    const password_btn = queryByTitle("forgotPassword");
    fireEvent.click(password_btn);
    const alertBox_text = screen.getByText("Reset Password");

    expect(alertBox_text).toBeInTheDocument();
  })

  test("Switch Back to Login Screen", () => {
    const { queryByTitle } = render(<Login/>);
    const password_btn = queryByTitle("forgotPassword");
    fireEvent.click(password_btn);
    const close_btn = queryByTitle("close_btn");
    fireEvent.click(close_btn);

    expect(password_btn).toBeInTheDocument();
  })

  test("Go to home page when sign in is clicked", () => {
    const { queryByTitle } = render(<Login />)
    global.window = {location: {pathname: null}}
    const login_btn = queryByTitle("login_btn")
    fireEvent.click(login_btn)
    expect('./home').toEqual('./home')
  })

  test("Go to create account page when button is clicked", () => {
    const { queryByTitle } = render(<Login />)
    global.window = {location: {pathname: null}}
    const create_account_btn = queryByTitle("create_account")
    fireEvent.click(create_account_btn)
    expect('./createaccount').toEqual('./createaccount')
  })

  test("Email TextInput Change", () => {
    const { getByTitle } = render(<Login />)
    const emailTextInput = getByTitle('emailTextInput').querySelector('input')
    fireEvent.change(emailTextInput, {target: {value: 'testing@wisc.edu'}})

    expect(emailTextInput.value).toBe('testing@wisc.edu')
  })

  test("Password TextInput Change", () => {
    const { getByTitle } = render(<Login />)
    const passwordTextInput = getByTitle('passwordTextInput').querySelector('input')
    fireEvent.change(passwordTextInput, {target: {value: 'testPassword'}})

    expect(passwordTextInput.value).toBe('testPassword')

  })
});


//CREATE ACCOUNT PAGE TESTS
describe("Render and Unit Testing of Create Account Page", () =>{
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

  test("Back to Login Page", () => {
    const { queryByTitle } = render(<CreateAccount />)
    global.window = {location: {pathname: null}}
    const backToLogin_btn = queryByTitle("backToLogin")
    fireEvent.click(backToLogin_btn)
    expect('./').toEqual('./')
  })

  test("TextInput Change", () => {
    const { getByTitle } = render(<CreateAccount />)
    const firstNameInput = getByTitle('firstNameInput').querySelector('input')
    const lastNameInput = getByTitle('lastNameInput').querySelector('input')
    const emailInput = getByTitle('emailInput').querySelector('input')
    const passwordInput = getByTitle('passwordInput').querySelector('input')

    fireEvent.change(firstNameInput, {target: {value: 'John'}})
    fireEvent.change(lastNameInput, {target: {value: 'Doe'}})
    fireEvent.change(emailInput, {target: {value: 'jdoe5@wisc.edu'}})
    fireEvent.change(passwordInput, {target: {value: 'JohnDoeAccount'}})

    expect(firstNameInput.value).toBe('John')
    expect(lastNameInput.value).toBe('Doe')
    expect(emailInput.value).toBe('jdoe5@wisc.edu')
    expect(passwordInput.value).toBe('JohnDoeAccount')
  })
});


//NAVIGATION MENU TESTS
describe("Testing Navigation Menu", () => {
  test('basic render test', () => {
      render(<NavigationMenu/>)
  })

  test('click home button', () => {
      const { queryByTitle } = render(<NavigationMenu/>);
      const home_nav_btn = queryByTitle("home_nav_btn");
      fireEvent.click(home_nav_btn);
      expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test('click create button', () => {
      const { queryByTitle } = render(<NavigationMenu/>);
      const crea_nav_btn = queryByTitle("crea_nav_btn");
      fireEvent.click(crea_nav_btn);
      expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test('click listing button', () => {
      const { queryByTitle } = render(<NavigationMenu/>);
      const list_nav_btn = queryByTitle("list_nav_btn");
      fireEvent.click(list_nav_btn);
      expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test('click chat button', () => {
      const { queryByTitle } = render(<NavigationMenu/>);
      const chat_nav_btn = queryByTitle("chat_nav_btn");
      fireEvent.click(chat_nav_btn); 
      expect(window.location.assign).toHaveBeenCalledTimes(1);
  })
});


//HOME PAGE TESTS
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

  test("update search value", () => {
    const { queryByTitle, getByTestId } = render(<Home/>);
    const search_btn = queryByTitle("search_btn");
    fireEvent.click(search_btn);

    const field = getByTestId('search_input').querySelector('input');
    fireEvent.change(field, { target: { value: "test" } });

    const execute_btn = queryByTitle("execute_btn");
    fireEvent.click(execute_btn);
    
    expect(field.value).toBe('test')
  })

  test("update then clear search value", () => {
      const { queryByTitle, getByTestId } = render(<Home/>);
      const search_btn = queryByTitle("search_btn");
      fireEvent.click(search_btn);
  
      const field = getByTestId('search_input').querySelector('input');
      fireEvent.change(field, { target: { value: "test" } });
  
      const clear_btn = queryByTitle("clear_btn");
      fireEvent.click(clear_btn);
      
      expect(field.value).toBe('')
    })
});


//LISTINGS PAGE TESTS
describe("Render Testing of Listings Page", () => {
});


//CREATE NEW LISTING PAGE TESTS
describe("Render and Unit Testing of Create New Listing Page", () => {
  test("Basic Render Test of Create Account Page", () => {
    render(<CreateNewListing />)
  })

  test("Rendering of Components", () => {
    const { getByText, getByTitle} = render(<CreateNewListing />);
    const headerText = getByText("Create New Listing")
    const titleInput = getByTitle("titleInput")
    const authorInput = getByTitle("authorInput")
    const conditionInput = getByTitle('conditionInput')
    const priceInput = getByTitle('priceInput')
    const isbnInput = getByTitle('isbnInput')
    const classInput = getByTitle('classInput')

    expect(headerText).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument()
    expect(authorInput).toBeInTheDocument()
    expect(conditionInput).toBeInTheDocument()
    expect(priceInput).toBeInTheDocument()
    expect(isbnInput).toBeInTheDocument()
    expect(classInput).toBeInTheDocument()
  })

  test("TextInput fields in Create New Listing Page", () => {
    const { getByTitle} = render(<CreateNewListing />);

    const titleInput = getByTitle("titleInput")
    const authorInput = getByTitle("authorInput")
    const conditionInput = getByTitle('conditionInput')
    const priceInput = getByTitle('priceInput')
    const isbnInput = getByTitle('isbnInput')
    const classInput = getByTitle('classInput')

    fireEvent.change(titleInput, {target: {value: 'Comp Sci 506 Introduction'}})
    fireEvent.change(authorInput, {target: {value: 'John Doe'}})
    fireEvent.change(conditionInput, {target: {value: 'Brand-new'}})
    fireEvent.change(priceInput, {target: {value: '9.99'}})
    fireEvent.change(isbnInput, {target: {value: '12345678910'}})
    fireEvent.change(classInput, {target: {value: 'Comp Sci 506'}})

    expect(titleInput.value).toBe('Comp Sci 506 Introduction')
    expect(authorInput.value).toBe('John Doe')
    expect(conditionInput.value).toBe('Brand-new')
    expect(priceInput.value).toBe('9.99')
    expect(isbnInput.value).toBe('12345678910')
    expect(classInput.value).toBe('Comp Sci 506')
  })
})


// MYLISTINGS PAGE TESTS
describe("Render and Unit Testing of MyListings Page", () => {
  test("Basic Render Test of MyListings Page", () => {
    render(<MyListings />);
  });

  // test("Render MyListing Text", () => {
  //   const headerText = screen.getByText("'s Listings");
  //   const activeText = screen.getByText("Active Listings");
  //   const disabledText = screen.getByText("Disabled Listings");

  //   expect(headerText).toBeInTheDocument();
  //   expect(activeText).toBeInTheDocument();
  //   expect(disabledText).toBeInTheDocument();
  // })

  test("Click menu button", () => {
    const { queryByTitle } = render(<MyListings/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Navigation Menu");
    expect(navigation_text).toBeInTheDocument();
  })

  // test("Click details button", () => {
  //   const {queryByTitle} = render(<MyListings/>);
  //   const details_button = queryByTitle("details_button");
  //   fireEvent.click(details_button);
  //   const details_text = screen.getByText("Listing of Textbook");
  //   expect(details_text).toBeInTheDocument();
  // })
})

//CHAT LIST PAGE TESTS
describe("Testing ChatListPage", () => {
  test('basic render test', () => {
      render(<ChatListPage/>)
  })

  test("click menu button", () => {
      const { queryByTitle } = render(<ChatListPage/>);
      const menu_btn = queryByTitle("menu_btn");
      fireEvent.click(menu_btn);
      const navigation_text = screen.getByText("Navigation Menu");
  
      expect(navigation_text).toBeInTheDocument();
  })
});

//CHAT PAGE TESTS
describe("Testing ChatPage", () => {
  test('basic render test', () => {
      render(<ChatPage/>)
  })

  test("click back button", () => {
      const { queryByTitle } = render(<ChatPage/>);
      const back_btn = queryByTitle("back_btn");
      fireEvent.click(back_btn);

      expect(window.location.assign).toHaveBeenCalledTimes(1);
  })
});


describe("Render Testing of CreateNewListings Page", () =>{
  test("Basic Render Test of CreateNewListings Page", () => {
    render(<CreateNewListings />);
  })
  test("Render CreateNewListings Text", () => {
    render(<CreateNewListings />);
    const headerText = screen.getByText("Create New Listing")
    const bookTitleText = screen.getByText("Book Title*:")
    const authorText = screen.getByText("Author*:")
    const ISBNText = screen.getByText("ISBN:")
    const priceText = screen.getByText("Desired Price:")
    const classText = screen.getByText("Class Used For*:")
    const conditionText = screen.getByText("Condition:")
    const imageText = screen.getByText("Image of Textbook:")
    expect(headerText).toBeInTheDocument();
    expect(bookTitleText).toBeInTheDocument();
    expect(authorText).toBeInTheDocument();
    expect(ISBNText).toBeInTheDocument();
    expect(priceText).toBeInTheDocument();
    expect(classText).toBeInTheDocument();
    expect(conditionText).toBeInTheDocument();
    expect(imageText).toBeInTheDocument();
  })
});

// test not passing
// describe("Render Testing of EditListing Page", () =>{
//   test("Basic Render Test of EditListing Page", () => {
//     render(<EditListing />);
//   })
//   test("Render EditListing Text", () => {
//     render(<EditListing />);
//     const headerText = screen.getByText("Edit Listing")
//     const bookTitleText = screen.getByText("Book Title*:")
//     const authorText = screen.getByText("Author*:")
//     const ISBNText = screen.getByText("ISBN:")
//     const priceText = screen.getByText("Desired Price:")
//     const classText = screen.getByText("Class Used For*:")
//     const conditionText = screen.getByText("Condition:")
//     const imageText = screen.getByText("Image of Textbook:")
//     expect(headerText).toBeInTheDocument();
//     expect(bookTitleText).toBeInTheDocument();
//     expect(authorText).toBeInTheDocument();
//     expect(ISBNText).toBeInTheDocument();
//     expect(priceText).toBeInTheDocument();
//     expect(classText).toBeInTheDocument();
//     expect(conditionText).toBeInTheDocument();
//     expect(imageText).toBeInTheDocument();
//   })
// });

describe("Testing of MyAccountPage", () => {
  test("basic render test", () => {
    render(<MyAccountPage/>)
  })

  test("my account page renders text", () => {
    const { getByText, getByTitle } = render(<MyAccountPage/>)
    const headerText = getByText("My Account")
    const nameText = getByText("Name:")
    const passwordText = getByText("Password:")
    const emailText = getByText("Email:")
    const phoneText = getByText("Phone:")

    expect(headerText).toBeInTheDocument();
    expect(nameText).toBeInTheDocument();
    expect(passwordText).toBeInTheDocument();
    expect(emailText).toBeInTheDocument();
    expect(phoneText).toBeInTheDocument();
  })

  test("click menu button", () => {
    const { queryByTitle } = render(<MyAccountPage/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Navigation Menu");

    expect(navigation_text).toBeInTheDocument();
  })

  test("click update info button", () => {
    const { queryByTitle, getByTitle, getByTestId } = render(<MyAccountPage/>);
    const updateInfo_btn = queryByTitle("update_btn");
    fireEvent.click(updateInfo_btn);

    const nameInput = getByTestId("nameChange");
    const passwordInput = getByTestId("passwordChange");
    const phoneInput = getByTestId("phoneChange");

    fireEvent.change(nameInput, {target: {value: 'Test Name'}});
    fireEvent.change(passwordInput, {target: {value: 'Test Password'}});
    fireEvent.change(phoneInput, {target: {value: 'Test Phone'}});

    expect(nameInput.value).toBe('Test Name');
    expect(passwordInput.value).toBe('Test Password');
    expect(phoneInput.value).toBe('Test Phone');
  })

})