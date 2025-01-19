import React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VerificationScreen from "./VerificationScreen";
import InstructionScreen from "./InstructionScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Verification">
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="Instructions" component={InstructionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
