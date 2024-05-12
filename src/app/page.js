import React from 'react';
import RestaurantCards from './components/restaurantCards';
import './pages.css';

export default function Home() {

  return (
    <div>
        <header>
            Welcome to Food Finder!!!
          <h1>This website returns a list of random restaurants near you!</h1>
        </header>
        <div class = "page-container">
            <div class = "content-wrap">
              
              <h2>Click the button below to get started!</h2>
              <RestaurantCards />
            </div>
            <footer>
              Note* Not all restaurants may be open, site is based of google places api and may not be up to date.
            </footer>
        </div>
    </div>
  );
}

