import { Text, View, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <>
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
            placeholder="Enter your text"
            className="min-h-32 text-xl   flex-1"
            multiline
            maxLength={300}
          />

          {/* Send Button */}
          <FontAwesome6 name="circle-arrow-right" size={24} color="royalblue" />
        </View>
        <View className="flex-row justify-between">
          {/* Mic Icon */}
          <FontAwesome6 name="microphone" size={18} color="dimgray" />
          <Text className="color-gray-500">0 / 5000</Text>
        </View>
      </View>

      {/* Output Container */}

      <View className="gap-5 p-5 bg-gray-300">
        <Text className="min-h-32 text-xl">Output</Text>
        <View className="flex-row justify-between">
          <FontAwesome6 name="volume-high" size={18} color="dimgray" />
          <FontAwesome5 name="copy" size={18} color="dimgray" />
        </View>
      </View>
    </>
  );
}
