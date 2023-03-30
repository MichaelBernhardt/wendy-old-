import AsyncStorage from '@react-native-async-storage/async-storage';

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

export const storeAPIKey = async (apiKey: string): Promise<void> => {
  await AsyncStorage.setItem('chatgpt_api_key', apiKey);
};

export const getAPIKey = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('chatgpt_api_key');
};

export const chatWithGPT = async (message: string): Promise<string> => {
  const apiKey = await getAPIKey();
  if (!apiKey) {
    throw new Error('API key not found');
  }

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: `User: ${message}\nChatGPT:`,
      max_tokens: 100,
      n: 1,
      stop: ['\n'],
      temperature: 0.8,
    }),
  };

  const response = await fetch(OPENAI_API_URL, requestOptions);
  if (!response.ok) {
    throw new Error(`Error fetching ChatGPT response: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].text.trim();
};
