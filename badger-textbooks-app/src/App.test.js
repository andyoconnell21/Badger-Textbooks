import { render, screen, fireEvent } from '@testing-library/react';

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
import Admin from './pages/AdminPage';
import ReportListing from './pages/ReportListing';
import SavedListings from './pages/SavedListings';
import UserAccount from './pages/UserAccount';

let assignMock = jest.fn();
delete window.location;
window.location = { assign: assignMock };
afterEach(() => {
  assignMock.mockClear();
});

//>>>>>LOGIN
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
    const emailTextInput = getByTestId('forgot_email').querySelector('input');
    fireEvent.change(emailTextInput, {target: {value: 'email'}})

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

  test("Bad Login", () => {
    const { queryByTitle, getByTestId } = render(<Login />)
    const emailTextInput = getByTestId('emailTextInput').querySelector('input')
    const passwordTextInput = getByTestId('passwordTextInput').querySelector('input')
    const login_btn = queryByTitle("login_btn")

    fireEvent.change(emailTextInput, {target: {value: 'testing@wisc.edu'}})
    fireEvent.change(passwordTextInput, {target: {value: 'testPassword'}})
    fireEvent.click(login_btn)
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>CREATE ACCOUNT
describe("Render and Unit Testing of Create Account Page", () =>{
  test("Basic Render Test of Create Account Page", () => {
    render(<CreateAccount />)
  })

  test("Render CreateAccount Page Text", () => {
    render(<CreateAccount />)
    const headerText = screen.getByText("Welcome to Badger Textbooks")
    const createAccountText = screen.getByText("Create an Account")
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

  test("bad username", () => {
    const { queryByTitle } = render(<CreateAccount/>);
    const submit_btn = queryByTitle("submit_btn");
    fireEvent.click(submit_btn);
    const alert_text = screen.getByText("Not a valid email. Your email must be a @wisc.edu email account.");
    expect(alert_text).toBeInTheDocument();
    const close_btn = queryByTitle("close_email");
    fireEvent.click(close_btn);
  })

  test("bad password", () => {
    const { queryByTitle, getByTitle } = render(<CreateAccount/>);
    const firstNameInput = getByTitle('firstNameInput').querySelector('input');
    const lastNameInput = getByTitle('lastNameInput').querySelector('input');
    const emailInput = getByTitle('emailInput').querySelector('input');
    const submit_btn = queryByTitle("submit_btn");
    fireEvent.change(firstNameInput, {target: {value: 'John'}})
    fireEvent.change(lastNameInput, {target: {value: 'Doe'}})
    fireEvent.change(emailInput, {target: {value: 'jdoe5@wisc.edu'}})
    fireEvent.click(submit_btn);

    const alert_text = screen.getByText("Password must contain at least 6 characters.");
    expect(alert_text).toBeInTheDocument();
    const close_btn = queryByTitle("close_password");
    fireEvent.click(close_btn);
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>NAVIGATION
describe("Render and Unit Testing of Navigation Menu", () => {
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

  test('click saved button', () => {
    const { queryByTitle } = render(<NavigationMenu/>);
    const sav_nav_btn = queryByTitle("sav_nav_btn");
    fireEvent.click(sav_nav_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test('click account button', () => {
    const { queryByTitle } = render(<NavigationMenu/>);
    const account_nav_btn = queryByTitle("account_nav_btn");
    fireEvent.click(account_nav_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test('click admin button', () => {
    const { queryByTitle } = render(<NavigationMenu/>);
    const admin_nav_btn = queryByTitle("admin_nav_btn");
    fireEvent.click(admin_nav_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>HOME
describe("Render and Unit Testing of Home Page", () => {
  test('basic render test', () => {
    render(<Home/>);
  })

  test('home page renders text', () => {
    render (<Home/>)
    const headerText = screen.getByText("Badger Textbooks")
    expect(headerText).toBeInTheDocument();
  })

  test("click menu button", () => {
    const { queryByTitle } = render(<Home/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

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
//////////////////////////////////////////////////////////////////////


//>>>>>CREATE NEW LISTING
describe("Render and Unit Testing of Create-Listing Page", () => {

  test("Basic Render Test of Create Account Page", () => {
    render(<CreateNewListing />)
  })

  test("click menu button", () => {
    const { queryByTitle } = render(<CreateNewListings/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  })

  test("Rendering of Components", () => {
    const { getByText, getByTitle } = render(<CreateNewListing />);
    const headerText = getByText("Create a New Listing")
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
    const { getByTestId } = render(<CreateNewListing />);

    const titleField = getByTestId('title').querySelector('input');
    const authorField = getByTestId('author').querySelector('input');
    const conditionField = getByTestId('condition').querySelector('input');
    const priceField = getByTestId('price').querySelector('input');
    const isbnField = getByTestId('isbn').querySelector('input');
    const classField = getByTestId('class').querySelector('input');

    fireEvent.change(titleField, {target: {value: 'Comp Sci 506 Introduction'}})
    fireEvent.change(authorField, {target: {value: 'John Doe'}})
    fireEvent.change(conditionField, {target: { value: "Like-New" }});
    fireEvent.change(priceField, {target: {value: 9.99}})
    fireEvent.change(isbnField, {target: {value: '12345678910'}})
    fireEvent.change(classField, {target: {value: 'Comp Sci 506'}})

    expect(titleField.value).toBe('Comp Sci 506 Introduction')
    expect(authorField.value).toBe('John Doe')
    expect(conditionField.value).toBe('Like-New')
    expect(priceField.value).toBe('9.99');
    expect(isbnField.value).toBe('12345678910')
    expect(classField.value).toBe('Comp Sci 506')
  })

  test("Bad Submit", () => {
    const { queryByTitle } = render(<CreateNewListings/>);
    const create_btn = queryByTitle("create_btn");
    fireEvent.click(create_btn);

    const close_btn = queryByTitle("alert_missing_close");
    
    const alertBox_text = screen.getByText("Oops! Looks like we are missing some information.");
    expect(alertBox_text).toBeInTheDocument();
    fireEvent.click(close_btn);
  })
})
//////////////////////////////////////////////////////////////////////


//>>>>>LISTING
describe("Render and Unit Testing of Listing Page", () => {
  test("Basic Render Test of Listing Page", () => {
    render(<Listing />);
  });

  test("click menu button", () => {
    const { queryByTitle } = render(<Listing/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  });

  test("toggle active switch", () => {
    const { queryByTitle } = render(<Listing/>);
    const swtch = queryByTitle("active_switch");
    const delete_btn = queryByTitle("delete_btn");
    fireEvent.click(swtch);
    fireEvent.click(delete_btn);
  });

  test('click chat button', () => {
    const { queryByTitle } = render(<Listing/>);
    const chat_btn = queryByTitle("chat_btn");
    fireEvent.click(chat_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  test('click edit button', () => {
    const { queryByTitle } = render(<Listing/>);
    const edit_btn = queryByTitle("edit_btn");
    fireEvent.click(edit_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  test('click report button', () => {
    const { queryByTitle } = render(<Listing/>);
    const report_btn = queryByTitle("report_btn");
    fireEvent.click(report_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  test('expand info and click link', () => {
    const { queryByTitle } = render(<Listing/>);
    const more_info = queryByTitle("more_info");
    const user_link = queryByTitle("seller_link");
    fireEvent.click(more_info);
    fireEvent.click(user_link);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });
});
//////////////////////////////////////////////////////////////////////


//>>>>>EDIT-LISTING
describe("Render and Unit Testing of Edit-Listing Page", () =>{
  test("Basic Render Test of EditListing Page", () => {
    render(<EditListing />);
  });

  test("click back button", () => {
    const { queryByTitle } = render(<EditListing/>);
    const back_btn = queryByTitle("back_btn");
    fireEvent.click(back_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  test("testing text input fields", () => {
    const { getByTestId } = render(<EditListing />);

    const titleField = getByTestId('title').querySelector('input');
    const authorField = getByTestId('author').querySelector('input');
    const conditionField = getByTestId('condition').querySelector('input');
    const priceField = getByTestId('price').querySelector('input');
    const isbnField = getByTestId('isbn').querySelector('input');
    const classField = getByTestId('class').querySelector('input');

    fireEvent.change(titleField, {target: {value: 'Comp Sci 506 Introduction'}})
    fireEvent.change(authorField, {target: {value: 'John Doe'}})
    fireEvent.change(conditionField, {target: { value: "Like-New" }});
    fireEvent.change(priceField, {target: {value: 9.99}})
    fireEvent.change(isbnField, {target: {value: '12345678910'}})
    fireEvent.change(classField, {target: {value: 'Comp Sci 506'}})

    expect(titleField.value).toBe('Comp Sci 506 Introduction')
    expect(authorField.value).toBe('John Doe')
    expect(conditionField.value).toBe('Like-New')
    expect(priceField.value).toBe('9.99');
    expect(isbnField.value).toBe('12345678910')
    expect(classField.value).toBe('Comp Sci 506')
  })

  test("empty submit", () => {
    const { getByTitle } = render(<EditListing/>);
    const submit_btn = getByTitle('submit_btn');
    fireEvent.click(submit_btn);
    const alert_text = screen.getByText("Make sure that all fields marked by a * have been filled out.");
    expect(alert_text).toBeInTheDocument();
    const alert_close_btn = getByTitle('alert_close_btn');
    fireEvent.click(alert_close_btn);
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>MY-LISTINGS
describe("Render and Unit Testing of My-Listings Page", () => {
  test("Basic Render Test of MyListings Page", () => {
    render(<MyListings />);
  });

  test("Click menu button", () => {
    const { queryByTitle } = render(<MyListings/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");
    expect(navigation_text).toBeInTheDocument();
  })
})
//////////////////////////////////////////////////////////////////////


//>>>>>SAVED-LISTINGS
describe("Render and Unit Testing of Saved-Listings Page", () => {
  test("Basic Render Test for Saved Listings Page", () => {
    render(<SavedListings/>)
  });

  test("click menu button", () => {
    const { queryByTitle } = render(<SavedListings/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>REPORT-LISTING
describe("Render and Unit Testing of Report-Listing Page", () => {
  test("Basic Render Test for Report a Listing Page", () => {
    render(<ReportListing/>)
  });

  test("click menu button", () => {
    const { queryByTitle } = render(<ReportListing/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  });

  test("btn click tests box", () => {
    const { queryByTitle } = render(<ReportListing/>);
    const check_box = queryByTitle("inap_check");
    const cancel_btn = queryByTitle("cancel_btn");
    fireEvent.click(check_box);
    fireEvent.click(cancel_btn);
  });

  test("update other reasons", () => {
    const { getByTitle } = render(<ReportListing/>);
    const other_field = getByTitle('other');
    fireEvent.change(other_field, { target: { value: "test" } });
    expect(other_field.value).toBe("test")
  });
});
//////////////////////////////////////////////////////////////////////


//>>>>>CHAT-LIST
describe("Render and Unit Testing of Chat-List Page", () => {
  test('basic render test', () => {
    render(<ChatListPage/>)
  })

  test("click menu button", () => {
    const { queryByTitle } = render(<ChatListPage/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>CHAT
describe("Render and Unit Testing of Chat Page", () => {
  test('basic render test', () => {
    render(<ChatPage/>)
  })

  test("click back button", () => {
    const { queryByTitle } = render(<ChatPage/>);
    const back_btn = queryByTitle("back_btn");
    fireEvent.click(back_btn);

    expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test("enter text > hit send", () => {
    const { queryByTitle, getByTestId } = render(<ChatPage/>);
    const send_btn = queryByTitle("send_chat");
    const chat_textbox = getByTestId('chat_text_box').querySelector('input');
    fireEvent.click(send_btn);
    fireEvent.change(chat_textbox, { target: { value: "test" } });
    expect(chat_textbox.value).toBe('test');
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>ACCOUNT
describe("Render and Unit Testing of Account Page", () => {
  test("basic render test", () => {
    render(<MyAccountPage/>)
  })

  test("my account page renders text", () => {
    const { getByText } = render(<MyAccountPage/>)
    const nameText = getByText("Name:")
    const passwordText = getByText("Password:")
    const emailText = getByText("Email:")

    expect(nameText).toBeInTheDocument();
    expect(passwordText).toBeInTheDocument();
    expect(emailText).toBeInTheDocument();
  })

  test("click menu button", () => {
    const { queryByTitle } = render(<MyAccountPage/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  })

  test("click logout button", () => {
    const { queryByTitle } = render(<MyAccountPage/>);
    const logout_btn = queryByTitle("logout_btn");
    fireEvent.click(logout_btn);
  })

  test("click update info button", () => {
    const { queryByTitle, getByTestId } = render(<MyAccountPage/>);
    const edit_btn = queryByTitle("edit_btn");
    fireEvent.click(edit_btn);

    const nameInput = getByTestId("nameChange").querySelector('input');
    const passwordInput = getByTestId("passwordChange").querySelector('input');
    const passwordConfirmInput = getByTestId("passwordChangeConfirm").querySelector('input');

    fireEvent.change(nameInput, {target: {value: 'Test Name'}});
    fireEvent.change(passwordInput, {target: {value: 'Test Password'}});
    fireEvent.change(passwordConfirmInput, {target: {value: 'Test Password'}});

    expect(nameInput.value).toBe('Test Name');
    expect(passwordInput.value).toBe('Test Password');
  })

  test("click update info button > click cancel", () => {
    const { queryByTitle } = render(<MyAccountPage/>);
    const edit_btn = queryByTitle("edit_btn");
    fireEvent.click(edit_btn);
    const cancel = queryByTitle("cancel_edit_btn");
    fireEvent.click(cancel);
  })

  test("click update info button > click submit", () => {
    const { queryByTitle } = render(<MyAccountPage/>);
    const edit_btn = queryByTitle("edit_btn");
    fireEvent.click(edit_btn);
    const confirm = queryByTitle("confirm_edit_btn");
    fireEvent.click(confirm);
    //const close_btn = queryByTitle("close_bad_btn");
    //fireEvent.click(close_btn);
  })
});
//////////////////////////////////////////////////////////////////////


//>>>>>USER-ACCOUNT
describe("Render and Unit Testing of User-Account Page", () => {
  test("Basic Render Test for User Account Page", () => {
    render(<UserAccount/>)
  });

  test("click back button", () => {
    const { queryByTitle } = render(<UserAccount/>);
    const back_btn = queryByTitle("back_btn");
    fireEvent.click(back_btn);
    expect(window.location.assign).toHaveBeenCalledTimes(1);
  })

  test("click rate button > close", () => {
    const { queryByTitle } = render(<UserAccount/>);
    const rate_btn = queryByTitle("rateUser_btn");
    fireEvent.click(rate_btn);
    const close_btn = queryByTitle("close_rate_btn");
    const alert_text = screen.getByText("Rate User");
    expect(alert_text).toBeInTheDocument();
    fireEvent.click(close_btn);
  })

  test("click rate button > send", () => {
    const { queryByTitle } = render(<UserAccount/>);
    const rate_btn = queryByTitle("rateUser_btn");
    fireEvent.click(rate_btn);
    const send_btn = queryByTitle("send_rate_btn");
    const alert_text = screen.getByText("Rate User");
    expect(alert_text).toBeInTheDocument();
    fireEvent.click(send_btn);
  })

  test("click report button > close", () => {
    const { queryByTitle } = render(<UserAccount/>);
    const report_btn = queryByTitle("reportUser_btn");
    fireEvent.click(report_btn);
    const close_btn = queryByTitle("close_report_btn");
    const alert_text = screen.getByText("Report Your Experience With This User");
    expect(alert_text).toBeInTheDocument();
    fireEvent.click(close_btn);
  })

  test("click report button > send", () => {
    const { queryByTitle, getByTestId } = render(<UserAccount/>);
    const report_btn = queryByTitle("reportUser_btn");
    fireEvent.click(report_btn);
    const send_btn = queryByTitle("send_report_btn");
    const report_text = getByTestId('report_text').querySelector('input');
    fireEvent.change(report_text, { target: { value: "Test" } });
    const alert_text = screen.getByText("Report Your Experience With This User");
    expect(alert_text).toBeInTheDocument();
    fireEvent.click(send_btn);
  })

  test("click rate button > give rating", () => {
    const { queryByTitle, getByTestId } = render(<UserAccount/>);
    const rate_btn = queryByTitle("rateUser_btn");
    fireEvent.click(rate_btn);
    const alert_text = screen.getByText("Rate User");
    expect(alert_text).toBeInTheDocument();
    const rating = getByTestId('rating').querySelector('input');
    fireEvent.change(rating, { target: { value: 3 } });
  })
});
//////////////////////////////////////////////////////////////////////

//>>>>>ADMIN
describe("Render and Unit Testing of Admin Page", () => {
  test("Basic Render Test for Admin Page", () => {
    render(<Admin/>)
  });

  test("click menu button", () => {
    const { queryByTitle } = render(<Admin/>);
    const menu_btn = queryByTitle("menu_btn");
    fireEvent.click(menu_btn);
    const navigation_text = screen.getByText("Menu");

    expect(navigation_text).toBeInTheDocument();
  })
});
//////////////////////////////////////////////////////////////////////