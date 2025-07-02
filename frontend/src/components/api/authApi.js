import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/clients';

export const generateKey = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const validateKey = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/validate`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const unlockClient = async (productKey) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/unlock`, { productKey });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
