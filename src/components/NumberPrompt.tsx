import { Dialog, Input } from "@rneui/themed";
import { useState } from "react";
import { Alert } from 'react-native'

interface NumberPromptProps{
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	operation: (n: number) => any;
	isVisible: boolean;
	togglePrompt: () => void;
}

//TODO: implement the scroll wheel, maybe
export default function NumberPrompt({ value, setValue, isVisible, togglePrompt, operation }: NumberPromptProps): JSX.Element{
	const [num, setNum] = useState<string>("")

	return (
		<Dialog
			isVisible={isVisible}
			onBackdropPress={togglePrompt}
		>
		<Dialog.Title title="Escolha um Número"/>

		<Dialog.Actions>
			<Dialog.Button
			title="CONFIRM"
			onPress={() => {
				console.log(`The input was: ${num}`);
				try{
					if(num.length == 0){
						throw new Error("Nenhum valor inserido")
					}
					const number = Number(num)
					operation(number)
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