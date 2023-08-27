import React from 'react';
import { useEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ListItem, Button } from '@rneui/themed';

import { RootStackParamsList, Table } from '../types/types';
import TextPrompt from '../components/NamePrompt';

type Props = NativeStackScreenProps<RootStackParamsList, 'Menu'>;

export default function Menu({route, navigation}: Props): JSX.Element {
	const [shableIds, setShableIds] = useState<string[]>([])
	const [showPrompt, setShowPrompt] = useState<boolean>(false)

	useEffect(()=>{
		console.log("getting the tables")
		fetchTables()
	},[])
	async function fetchTables(){
		try{
			const ids = await AsyncStorage.getAllKeys()
			setShableIds([...ids])
		}catch(error){
			console.error(error)
			setShableIds([])
		}
	}
	async function addNewTable(id: string){
		//TODO: set table rows menu
		//by default is name and valor as a number
		const baseTable: Table = {
			headers: [
				{
					name: 'nome',
					datatype: 'string'
				},
				{
					name: 'valor',
					datatype: 'number'
				},
			],
			table: [
				["Pedro", '12'],
				["Eduardo", '176'],
				["João", '37']
			]
		}
		try{
			//check if table with id already exists
			await AsyncStorage.setItem(id, JSON.stringify(baseTable))
			setShableIds([...shableIds, id])
		}catch(error){
			console.log(error)
		}
	}

	const operationAddNewTable = (text: string) =>{
		if(shableIds.includes(text)){
			throw new Error(`Tabela com o nome ${text} já existe`)
		}
		addNewTable(text)
	}

	const params = {
		shableId: "hello World"
	}
	return (
		<SafeAreaView>
			<View>
				{shableIds.map((id, i) => {
					return (
						<ListItem key={i} bottomDivider onPress={() => navigation.navigate('Shable', { shableId: id })}>
							{/* add icon here:  https://reactnativeelements.com/docs/components/listitem */}
							<ListItem.Content>
								<ListItem.Title>Table {id}</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)
				})}
			</View>
			<TextPrompt 
				placeHolderText='Insira um nome para a Tabela'
				isVisible={showPrompt} 
				togglePrompt={() => setShowPrompt(!showPrompt)} 
				operation={operationAddNewTable}
			/>
			<Button title='Make Shable' onPress={() => setShowPrompt(true)}/>
		</SafeAreaView>
	)
}


