import { Text, View, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { FontAwesome6 } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const [recording, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const translate = async (text: string) => {
    const { data } = await supabase.functions.invoke('translate', {
      body: JSON.stringify({ input: text, from: 'English', to: 'Japanese' }),
    });

    return data?.content || 'Something went wrong!';
  };

  const onTranslate = async () => {
    const translation = await translate(input);
    setOutput(translation);
  };

  const textToSpeech = async (text: string) => {
    const { data } = await supabase.functions.invoke('text-to-speech', {
      body: JSON.stringify({ input: text }),
    });

    if (data) {
      const { sound } = await Audio.Sound.createAsync({
        uri: `data:audio/mp3;base64,${data.mp3Base64}`,
      });
      sound.playAsync();
    }
  };

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    if (uri) {
      const audioBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: JSON.stringify({ audioBase64 }),
      });
      setInput(data.text);
      const translation = await translate(data.text);
      setOutput(translation);

    }
  }

  return (
    <View>
      {/* Language selector row  */}

      <View className='flex-row justify-around p-5'>
        <Text className='font-semibold color-blue-600'>English</Text>
        <FontAwesome5 name='exchange-alt' size={16} color='black' />
        <Text className='font-semibold color-blue-600'>Japanese</Text>
      </View>
      {/* Input Container  */}
      <View className='border-y border-gray-300 p-5'>
        <View className='flex-row gap-5'>
          {/* Input */}
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder='Enter your text'
            className='min-h-32 text-xl flex-1'
            multiline
            maxLength={300}
          />

          {/* Send Button */}
          <FontAwesome6 onPress={onTranslate} name='circle-arrow-right' size={24} color='royalblue' />
        </View>
        <View className='flex-row justify-between'>
          {/* Mic Icon */}

          {recording ? (
            <Entypo onPress={stopRecording} name='controller-stop' size={24} color='royalblue' />
          ) : (
            <FontAwesome6 onPress={startRecording} name='microphone' size={18} color='dimgray' />
          )}

          <Text className='color-gray-500'>{input.length} / 5000</Text>
        </View>
      </View>

      {/* Output Container */}

      {output && (
        <View className='gap-5 p-5 bg-gray-200'>
          <Text className='min-h-32 text-xl'>{output}</Text>
          <View className='flex-row justify-between'>
            <FontAwesome6 name='volume-high' size={18} color='dimgray' onPress={() => textToSpeech(output)} />
            <FontAwesome5 name='copy' size={18} color='dimgray' />
          </View>
        </View>
      )}
    </View>
  );
}
