import { useState } from 'react';
import { Text, View, TextInput } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

import { translate, textToSpeech, audioToText } from '@/utils/translation';
import AudioRecording from '@/components/AudioRecording';

export default function HomeScreen() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const onTranslate = async () => {
    const translation = await translate(input);
    setOutput(translation);
  };

  const speechToText = async (uri: string) => {
    const text = await audioToText(uri);
    setInput(text);
    const translation = await translate(text);
    setOutput(translation);
  };

  return (
    <View>
      {/* Language selector row  */}
      <View className="flex-row justify-around p-5">
        <Text className="font-semibold color-blue-600">English</Text>
        <FontAwesome5 name="exchange-alt" size={16} color="black" />
        <Text className="font-semibold color-blue-600">Japanese</Text>
      </View>
      {/* Input Container  */}
      <View className="border-y border-gray-300 p-5">
        <View className="flex-row gap-5">
          {/* Input */}
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Enter your text"
            className="min-h-32 flex-1 text-xl"
            multiline
            maxLength={300}
          />

          {/* Send Button */}
          <FontAwesome6
            onPress={onTranslate}
            name="circle-arrow-right"
            size={24}
            color="royalblue"
          />
        </View>
        <View className="flex-row justify-between">
          {/* Mic Icon */}
          <AudioRecording onNewRecording={(uri) => speechToText(uri)} />

          <Text className="color-gray-500">{input.length} / 5000</Text>
        </View>
      </View>

      {/* Output Container */}

      {output && (
        <View className="gap-5 bg-gray-200 p-5">
          <Text className="min-h-32 text-xl">{output}</Text>
          <View className="flex-row justify-between">
            <FontAwesome6
              name="volume-high"
              size={18}
              color="dimgray"
              onPress={() => textToSpeech(output)}
            />
            <FontAwesome5 name="copy" size={18} color="dimgray" />
          </View>
        </View>
      )}
    </View>
  );
}
