import React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VerificationScreen from "./VerificationScreen";
import InstructionScreen from "./InstructionScreen";
import TiltScreen from "./TiltScreen";
import VerifiedScreen from "./VerifiedScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Verification">
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="Instructions" component={InstructionScreen} />
          <Stack.Screen name="Tilt" component={TiltScreen} />
          <Stack.Screen name="Verified" component={VerifiedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
