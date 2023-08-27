import { Dialog, Input } from "@rneui/themed";
import { Alert } from 'react-native'
import { DataType, dataTypeToKeyboard } from "../types/types";


interface ValuePromptProps {
	value: string;
	valueType: DataType;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	operation: () => any;
	isVisible: boolean;
	togglePrompt: () => void;
}

export default function ValuePrompt({ value, setValue, valueType, operation, isVisible, togglePrompt}: ValuePromptProps): JSX.Element{
	return (
		<Dialog
			isVisible={isVisible}
			onBackdropPress={togglePrompt}
		>
		<Dialog.Title title="Digite o valor"/>
		<Input
			onChangeText={v => setValue(v)}
			keyboardType={dataTypeToKeyboard(valueType)}
			value={value}
		/>
		<Dialog.Actions>
			<Dialog.Button
			title="CONFIRM"
			onPress={() => {
				console.log(`The input was: ${value}`);
				try{
					operation()
					togglePrompt();
				}catch(error){
					Alert.alert('Erro no input', `Valor inválido inserido:\n${error}`)
				}
			}}
			/>
			<Dialog.Button title="CANCEL" onPress={togglePrompt} />
		</Dialog.Actions>
    </Dialog>)
}