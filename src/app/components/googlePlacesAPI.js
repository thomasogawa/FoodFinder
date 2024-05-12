"use client";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Get nearby places from Google Places API
const fetchRandomBusinesses = async (location) => {
  try {
    const url = new URL(GOOGLE_PLACES_API_URL);
    url.searchParams.append('location', location);
    url.searchParams.append('type', 'restaurant');
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }
    const data = await response.json();
    // Randomize the array of businesses before returning
    console.log(response);
    console.log(data);
    const shuffled = data.results.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10); // return only 10 randomized businesses
  } catch (error) {
    console.error('Error fetching random businesses:', error);
    return [];
  }
};

export { fetchRandomBusinesses };