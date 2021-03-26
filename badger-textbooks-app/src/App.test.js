import { render, screen } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';

describe("Testing Home-Page", () => {
  test('basic render test', () => {
    render(<Home/>)
  })

  test('home page renders text', () => {
    render (<Home/>)
    expect(/Recent Listings/i).toBeInTheDocument();
    expect(/Search Listings By.../i).toBeInTheDocument();
  })

  
  
});