import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@rneui/themed';

import { RootStackParamsList } from './src/types/types';
import Menu from './src/screens/Menu'
import Shable from './src/screens/Shable'


const Stack = createNativeStackNavigator<RootStackParamsList>()

export default function App() {
	return (
	<ThemeProvider>
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Menu" component={Menu} initialParams={undefined}/>
				<Stack.Screen name="Shable" component={Shable}/>
			</Stack.Navigator>
		</NavigationContainer>
	</ThemeProvider>
	);
}