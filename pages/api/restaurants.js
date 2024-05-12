// pages/api/apiHandler.js
export default async function handler(req, res) {
    const location = req.query.location; // Get location from the query string
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

    try {
        const url = new URL(GOOGLE_PLACES_API_URL);
        url.searchParams.append('location', location); // Use the dynamic location from the query
        url.searchParams.append('radius', '5000');
        url.searchParams.append('type', 'restaurant');
        url.searchParams.append('opennow', 'true');
        url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
        // only grab 10 random businesses
        

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch businesses');
        }
        
        const data = await response.json();
        console.log("Google Server Response: ", data);
        const shuffled = data.results ? data.results.sort(() => 0.5 - Math.random()) : [];
        res.status(200).json(shuffled.slice(0, 10));
    } catch (error) {
        console.error('Error fetching random businesses:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
