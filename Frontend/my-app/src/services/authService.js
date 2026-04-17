import axios from 'axios';
const API = axios.create({
  baseURL: 'http://localhost:8000',
});

export const registerUser = async (userData) => {

  const response = await API.post('/auth/register', userData);
  return response.data; 
};

export const verifyEmail = async (email, otpCode) => {
  const response = await API.post('/auth/verify-email', {
    email: email,
    otp_code: otpCode
  });
  return response.data;
};