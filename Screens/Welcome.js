import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView} from 'react-native-safe-area-context'

const Welcome = () => {
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"red" }}>
    <View >
      <Text>Welcome</Text>
    </View>
    </SafeAreaView>
  )
}

export default Welcome