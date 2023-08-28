import React from 'react';
import { useEffect, useState } from 'react'
import { SafeAreaView, View, Alert, StyleSheet, ScrollView } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ListItem, Button, Text, Input, Icon, ButtonGroup } from '@rneui/themed';

import { RootStackParamsList, Table, Header, DataType } from '../types/types';

type Props = NativeStackScreenProps<RootStackParamsList, 'MakeShable'>;

//NOTE: se mudar os tipos suportados pelo datatype, mudar essa função
function idx2Datatype(i: number): DataType{
	if(i == 1){
		return 'number'
	}
	return 'string'
}

export default function MakeShable({ route, navigation }: Props): JSX.Element {
	const ids = route.params
	const [tableName, setTableName] = useState<string>("")
	const [columnEntries, setColumnEntries] = useState<{name: string, datatypeIndex: number}[]>([{name: '', datatypeIndex: 0}])

	async function addNewTable(){
		try{
			if(tableName.length === 0){
				throw new Error(`Insira um nome para tabela.`)
			}
			if(ids.includes(tableName)){
				throw new Error(`Tabela com nome ${tableName} já existe`)
			}
			if(columnEntries.length === 0){
				throw new Error(`Tabela não contém nenhum valor.`)
			}
			for(let i = 0; i < columnEntries.length; i++){
				if(columnEntries[i].name.length === 0){
					throw new Error(`Coluna de índice ${i} não possui nenhum valor`)
				}
			}
			const headers = columnEntries.map( ({name, datatypeIndex}) => ({ name, datatype: idx2Datatype(datatypeIndex) }))
			const table: Table = {
				headers,
				table: []
			}
			console.log(table)
			await AsyncStorage.setItem(tableName, JSON.stringify(table))
			navigation.navigate('Menu', { newId: tableName})
		}catch(error){
			console.log(error)
			Alert.alert("Falha na criação da Tabela", `${error}`)
		}
	}
	const changeColumnEntries = (index: number, field: string) => (text: string) => {
		const newArray = columnEntries.map((item, i) => {
			if (index === i) {
				return { ...item, [field]: text };
			} else {
				return item;
			}
		});
		setColumnEntries(newArray);
	};
	const addColumnEntries = () =>{
		const newArray = columnEntries
			.map(item =>({ ...item }));
		//console.log(newArray)
		
		setColumnEntries([...newArray, {name: '', datatypeIndex: 0}]);
	}
	const removeColumnEntries = (index: number) => () =>{
		const newArray = columnEntries
			.filter((_, i) => index != i)
			.map(item =>({ ...item }));
			
		setColumnEntries(newArray);
	}

	return (
		<SafeAreaView style={{flex: 1}}>
			<View>
				<Text> Criação de Tabela</Text>
				<Input
					placeholder='Nome da tabela'
					rightIcon={{ type: 'feather', name: 'edit-3' }}
					onChangeText={text => setTableName(text)} />
			</View>
			<ScrollView  style={{flex: 1}}>
				{columnEntries.map((col, i) => (
					<ListItem key={i} bottomDivider>
						<View style={{flex: 1, flexDirection: 'column'}}>
							<Input
								placeholder='Nome da Coluna'
								onChangeText={changeColumnEntries(i, 'name')}
								value={col.name}
							/>
							<ListItem.ButtonGroup
								buttons={['TEXTO', 'NÚMEROS']}
								selectedIndex={col.datatypeIndex}
								onPress={changeColumnEntries(i, 'datatypeIndex')}
								containerStyle={{ marginBottom: 20 }}
							/>
						</View>
						<Icon type='feather' name='trash-2' onPress={removeColumnEntries(i)}/>
					</ListItem>
				))}
			</ScrollView>
			<View style={{flexDirection: 'row', gap: 116, alignSelf: 'flex-end', margin: 15}}>
				<Button style={{flexGrow: 1}} title='Criar tabela' onPress={() => addNewTable()}/>
				<Button title='Adicionar Coluna' onPress={addColumnEntries}/>
			</View>
		</SafeAreaView>
	)
}