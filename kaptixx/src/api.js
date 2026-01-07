import axios from 'axios';

const BASE_URL = 'https://api.tvmaze.com';

export const fetchSchedule = async (date) => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  console.log("Fetching schedule for:", targetDate); 
  
  const { data } = await axios.get(`${BASE_URL}/schedule?country=US&date=${targetDate}`);
  return data;
};

export const fetchShowDetails = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/shows/${id}?embed=cast`);
  return data;
};
