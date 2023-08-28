import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, createTheme } from '@rneui/themed';

import { RootStackParamsList } from './src/types/types';
import Menu from './src/screens/Menu'
import Shable from './src/screens/Shable'
import MakeShable from './src/screens/MakeShable';

const Stack = createNativeStackNavigator<RootStackParamsList>()

const theme = createTheme({
	lightColors: {
		primary: '#ed3c2f',
	},
	darkColors: {
		primary: 'blue',
	},
	components: {
		Button: {
			raised: true,
		},
	},
});
  

export default function App() {
	return (
	<ThemeProvider theme={theme}>
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Menu" component={Menu} initialParams={{newId: undefined}}/>
				<Stack.Screen name="MakeShable" component={MakeShable}/>
				<Stack.Screen name="Shable" component={Shable}/>
			</Stack.Navigator>
		</NavigationContainer>
	</ThemeProvider>
	);
}