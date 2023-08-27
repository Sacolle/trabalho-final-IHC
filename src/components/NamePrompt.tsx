import { Dialog, Input } from "@rneui/themed";
import { useState } from "react";
import { Alert } from 'react-native'


interface TextPromptProps {
	placeHolderText: string;
	isVisible: boolean;
	togglePrompt: () => void;
	operation: (text: string) => any;
}

export default function TextPrompt({ placeHolderText, isVisible, togglePrompt, operation }: TextPromptProps): JSX.Element{
	const [text, setText] = useState<string>("")

	return (<Dialog
		isVisible={isVisible}
		onBackdropPress={togglePrompt}
		>
		<Dialog.Title title="Escreva a o nome da tabela"/>
		<Input
			placeholder={placeHolderText}
			onChangeText={value => setText(value)}
		/>
		<Dialog.Actions>
			<Dialog.Button
			title="CONFIRM"
			onPress={() => {
				console.log(`The input was: ${text}`);
				try{
					if(text.length == 0){
						throw new Error(`Nenhum valor inserido.`)
					}
					operation(text)
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