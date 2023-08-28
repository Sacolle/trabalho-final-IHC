import { KeyboardTypeOptions } from "react-native";

export type RootStackParamsList = {
	Menu: { 
		newId: string | undefined
	};
	MakeShable: string[];
	Shable: { 
		shableId: string
	};
}

//EXTEND: adicionar datatypes como timestamp e enums
export type DataType = "string" | "number"
export function dataTypeToKeyboard(d: DataType): KeyboardTypeOptions | undefined{
	switch (d) {
		case 'string':
			return "default"
		case 'number':
			return 'numeric'
		default:
			return undefined
	}
}


export interface Header{
	name: string,
	datatype: DataType
}

export interface Table{
	headers: Header[],
	table: string[][]
}