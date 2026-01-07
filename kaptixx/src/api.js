import axios from 'axios';

const BASE_URL = 'https://api.tvmaze.com';

// Update this function to accept a date parameter
export const fetchSchedule = async (date) => {
  // Logic: Use the date passed in, OR default to today if it's missing
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  // Debug: This will show up in your F12 Console
  console.log("Fetching schedule for:", targetDate); 
  
  const { data } = await axios.get(`${BASE_URL}/schedule?country=US&date=${targetDate}`);
  return data;
};

export const fetchShowDetails = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/shows/${id}?embed=cast`);
  return data;
};