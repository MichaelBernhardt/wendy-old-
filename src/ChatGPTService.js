import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  const apiKey = await AsyncStorage.getItem('chatgpt_api_key');
  config.headers.Authorization = `Bearer ${apiKey}`;
  return config;
});

export const storeAPIKey = async (apiKey) => {
  await AsyncStorage.setItem('chatgpt_api_key', apiKey);
};

export const chatWithGPT = async (prompt) => {
  try {
    const response = await instance.post('', {
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error interacting with ChatGPT API:', error);
    throw error;
  }
};
