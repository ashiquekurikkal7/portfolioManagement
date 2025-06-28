import axios from './axiosInstance';

const handleError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Unexpected error occurred';
  return { error: true, message };
};

export const apiGet = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return { error: false, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const apiPost = async (url, payload, config = {}) => {
  try {
    const response = await axios.post(url, payload, config);
    return { error: false, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const apiPut = async (url, payload, config = {}) => {
  try {
    const response = await axios.put(url, payload, config);
    return { error: false, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};
