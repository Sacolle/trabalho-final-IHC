import React from 'react';
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ListItem, FAB, Text, Dialog, Button } from '@rneui/themed';

import { RootStackParamsList, Table } from '../types/types';
import { Icon } from '@rneui/base';

type Props = NativeStackScreenProps<RootStackParamsList, 'Menu'>;

export default function Menu({route, navigation}: Props): JSX.Element {
	const { newId } = route.params
	const [shableIds, setShableIds] = useState<string[]>([])
	const [deleteId, setDeleteId] = useState<string | null>(null)
	useEffect(()=>{
		fetchTables()
	},[newId])
	async function fetchTables(){
		try{
			const ids = await AsyncStorage.getAllKeys()
			setShableIds([...ids])
		}catch(error){
			console.error(error)
			setShableIds([])
		}
	}
	async function deleteTable(){
		if(deleteId){
			try{
				await AsyncStorage.removeItem(deleteId)
				setShableIds(shableIds.filter(e => e != deleteId))
				setDeleteId(null)
			}catch(error){
				console.error(error)
			}
		}
	}
	return (
		<SafeAreaView style={{flex: 1}}>
			<Text h2 style={{margin: 10}}> Tabelas do usuário </Text>
			<ScrollView style={{margin: 10}}>
				{shableIds.map((id, i) => {
					return (
						<ListItem key={i} bottomDivider style={{marginBottom: 5}} onPress={() => navigation.navigate('Tabela', { shableId: id })}>
							<ListItem.Content>
								<ListItem.Title>{id}</ListItem.Title>
							</ListItem.Content>
							<Icon type='feather' name='trash-2' onPress={() => setDeleteId(id)}/>
						</ListItem>
					)
				})}
			</ScrollView>
			<Dialog
				isVisible={deleteId != null}
				onBackdropPress={() => setDeleteId(null)}
			>
				<Dialog.Title title="Atenção"/>
				<Text>Ao realizar a ação de deletar, as informações da Tabela 
					<Text style={{ fontWeight: 'bold'}}> {deleteId}</Text> serão perdidas para sempre.
				</Text>
				<Dialog.Actions>
					<Dialog.Button title="Deletar" onPress={() => deleteTable()}/>
					<Dialog.Button title="Cancelar" onPress={() => setDeleteId(null)}/>
				</Dialog.Actions>
			</Dialog>
			<View style={{alignItems: 'center', marginBottom: 20}}>
				<Button radius={"sm"} onPress={() => navigation.navigate('Criar Tabela', shableIds)}>
					Criar Tabela <Icon type='feather' name='file-plus' color='white'/>
				</Button>
			</View>
		</SafeAreaView>
	)
}


