import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import { chatWithGPT, storeAPIKey } from './src/ChatGPTService';

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [isKeyStored, setIsKeyStored] = useState(false);

  useEffect(() => {
    const checkAPIKey = async () => {
      const storedKey = await AsyncStorage.getItem('chatgpt_api_key');
      if (storedKey) {
        setIsKeyStored(true);x
      }
    };
    checkAPIKey();
  }, []);

  const handleStoreAPIKey = async () => {
    await storeAPIKey(apiKey);
    setIsKeyStored(true);
  };

  const handleSendMessage = async () => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    setMessage('');

    try {
      const response = await chatWithGPT(message);
      setMessages((prevMessages) => [...prevMessages, { text: response, sender: 'gpt' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isKeyStored) {
    return (
      <View style={styles.container}>
        <Text>Please enter your ChatGPT API key:</Text>
        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          style={styles.input}
          placeholder="API Key"
          autoCapitalize="none"
        />
        <Button title="Save API Key" onPress={handleStoreAPIKey} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {messages.map((msg, index) => (
          <Text key={index} style={msg.sender === 'user' ? styles.userMessage : styles.gptMessage}>
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type your message"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 5,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#c3c3c3',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  gptMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});

export default App;
