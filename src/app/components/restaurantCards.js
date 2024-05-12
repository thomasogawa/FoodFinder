"use client";
import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { fetchRandomBusinesses } from './googlePlacesAPI'; // Import the new function

export default function RestaurantCards() {
    const [businesses, setBusinesses] = useState([]);
    const [location, setLocation] = useState('');
    const [styleList, setStyleList] = useState([]);
    const [picking, setPicking] = useState(false);
    const [play1] = useSound('ding.mp3');
    const [play2] = useSound('kidscheer.mp3');
  
    function handleGetLocation() {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const newLocation = `${latitude},${longitude}`;
                setLocation(newLocation);  // Update state for potential other uses
                fetch(`/api/restaurants?location=${encodeURIComponent(newLocation)}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Data received:', data);
                        setBusinesses(data);
                        setStyleList(new Array(data.length).fill(0)); // Initialize styleList after data is fetched
                    })
                    .catch(error => {
                        console.error('Failed to fetch restaurants:', error);
                    });
            },
            error => {
                console.error('Failed to get current location:', error);
            }
        );
    }
    

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //function to randomly pick
    async function handleRandomPick() {
        // set the styleList to all 0s to reset
        setPicking(true);
        const numLoops = businesses.length + 5;
        let temp = [];
        for (let i = 0; i < businesses.length; i++) {
            temp.push(0);
        }
        setStyleList(temp);
        let prev = -1;
        for (let i = 0; i < numLoops; i++) {
            // randomly select a business
            let randomIndex = Math.floor(Math.random() * businesses.length);
            if(randomIndex === prev) {
                i--;
                continue;
            }
            prev = randomIndex;
            setStyleList(styleList => {
                const newStyleList = [...styleList]; // create a new array with the same content
                newStyleList[randomIndex] = 1; // update the value
                if (i === numLoops - 1) {
                    newStyleList[randomIndex] = 2;
                }
                return newStyleList; // return the new array
            });
            // wait for 1 second
            play1();
            await sleep(200 + i * 80);
            if (i === numLoops - 1) {
                play2();
                break;
            }
            setStyleList(styleList => {
                const newStyleList = [...styleList]; // create a new array with the same content
                newStyleList[randomIndex] = 0; // update the value
                return newStyleList; // return the new array
            });
        }
        setPicking(false);
    }

    

    return (
      <div>
        <div class = "button-container">
            <button onClick={handleGetLocation} className='random-button' disabled={picking}>Get Current Location</button>
        </div> 
        {location && 
            <div>
            <p>Click the button below to choose a select a random restaurant!</p>
            {businesses.length >= 1 && <div class = "button-container"><button onClick={handleRandomPick} disabled={picking} className='random-button'>Random Pick!</button></div>}
            <ul className='buslist'>
            {businesses.length > 0 ? (
                businesses.map((business, index) => (
                <li key={business.place_id} class = "restaurant-card" className={getClassForStyle(styleList[index])}>
                    <h3>{business.name}</h3>
                    <p>Address: {business.vicinity}</p>
                    <p>Rating: {business.rating}🌟</p>
                    <p>Price Level: {convertPriceLevelToDollarSigns(business.price_level)}</p>
                </li>
                ))
            ) : (
                <li>No businesses found. Try Again?</li>
            )}
            </ul>
            </div>
        }
      </div>
    );
  }

function getClassForStyle(value) {
    switch (value) {
        case 1:
            return "active";
        case 2:
            return "active-done";
        default:
            return "not-active";
    }
}


function convertPriceLevelToDollarSigns(priceLevel) {
    const dollarSigns = {
      0: 'Free',
      1: '$',
      2: '$$',
      3: '$$$',
      4: '$$$$'
    };
    return dollarSigns[priceLevel] || 'Not Available'; // Return 'Not Available' if the price level is undefined
  }
  
