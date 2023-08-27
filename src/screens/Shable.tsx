import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { RootStackParamsList, Table as TableType, DataType } from '../types/types';
import ValuePrompt from '../components/ValuePrompt';

type Props = NativeStackScreenProps<RootStackParamsList, 'Shable'>;


export default function Shable({ route, navigation }: Props): JSX.Element {
	const { shableId } = route.params
	const { getItem, setItem } = useAsyncStorage(shableId)
	const [ tableData, setTableData ] = useState<TableType | null>(null)
	//state for altering the table
	const [showPrompt, setShowPrompt] = useState<boolean>(false)
	const [[selectedRow, selectedCollum], setSelectCoords ] = useState<[number, number]>([0,0])
	const [selectedCellData, setSelectedCellData] = useState<string>("")
	const [selectedCellType, setSelectedCellType] = useState<DataType>('string')

	useEffect(()=>{
		readTableData()
	},[])

	async function readTableData(){
		try{
			const table = await getItem()
			if(table !== null){
				console.log("have table with id: ", shableId)
				console.log("os dados da shable são: ",table)
				setTableData(JSON.parse(table))
			}else{
				console.log("No data for table")
				setTableData(null)
			}
		}catch(error){
			console.error(error)
			setTableData(null)
		}
	}

	async function writeTableData(newValue: TableType){
		try{
			await setItem(JSON.stringify(newValue))
			setTableData(newValue)
		}catch(error){
			console.error(error)
			setTableData(null)
		}
	}

	const cellElement = (cellData: string, rowIndex: number, collumIndex: number) =>{
		const op = () => {
			//set a global x, y state and call prompt with a function that acess that state
			const dt = tableData?.headers[collumIndex].datatype
			if(dt){
				setSelectedCellType(dt)
				setSelectedCellData(cellData)
				setSelectCoords([collumIndex, rowIndex])
				//open prompt
				setShowPrompt(true)
			}else{
				console.error(`No dataType found for cell at (${rowIndex}, ${collumIndex}) with data ${cellData}`)
			}
		}
		return <TouchableOpacity onPress={op}>
			<View>
				<Text style={{textAlign: 'center'}}>{cellData}</Text>
			</View>
		</TouchableOpacity>
	}

	const changeTableOperation = () =>{
		const newTable = structuredClone(tableData)
		if(newTable != undefined){
			console.log("Selected")
			newTable.table[selectedCollum][selectedRow] = selectedCellData
			writeTableData(newTable)
		}else{
			throw new Error("O clone da tabela resultou em undefined")
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<Text> Tabela {shableId} </Text>
				{tableData && 
				<ScrollView horizontal={true}>
					<View>
						<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
							{/*widthArr={state.widthArr} can be used to set header sizes*/}
							<Row data={tableData.headers.map(v => v.name)}
								style={styles.header}
								widthArr={[100, 100]}
								textStyle={styles.text}
							/>
						</Table>
						<ScrollView style={styles.dataWrapper}>
							<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
							{tableData.table.map((rowData, index) => (
								<TableWrapper 
									key={index}
									style={styles.row}
								>
								{rowData.map((cellData, cellIndex) => (
									<Cell 
										key={cellIndex}
										data={cellElement(cellData, index, cellIndex)} 
										style={{width: 100}}
										textStyle={styles.text}
									/>
								))}
								</TableWrapper>
							))}
							</Table>
						</ScrollView>
					</View>
				</ScrollView>
				}
				{!tableData && <Text>No table Data</Text>}
			<ValuePrompt
				value={selectedCellData}
				valueType={selectedCellType}
				setValue={setSelectedCellData}
				operation={changeTableOperation}
				isVisible={showPrompt}
				togglePrompt={() => setShowPrompt(!showPrompt)}
			/>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
	header: { height: 50, backgroundColor: '#537791' },
	text: { textAlign: 'center', fontWeight: '100' },
	dataWrapper: { marginTop: -1 },
	row: { flexDirection:'row', height: 40, backgroundColor: '#E7E6E1' },
  });