import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { RootStackParamsList, Table as TableType, DataType } from '../types/types';
import ValuePrompt from '../components/ValuePrompt';
import { FAB, Text, useTheme } from '@rneui/themed';

type Props = NativeStackScreenProps<RootStackParamsList, 'Tabela'>;


export default function Shable({ route, navigation }: Props): JSX.Element {
	const { shableId } = route.params
	const { getItem, setItem } = useAsyncStorage(shableId)
	const [ tableData, setTableData ] = useState<TableType | null>(null)
	const [cellWidth, setCellWidth ] = useState<number[]>([100])
	//state for altering the table
	const [showPrompt, setShowPrompt] = useState<boolean>(false)
	const [[selectedRow, selectedCollum], setSelectCoords ] = useState<[number, number]>([0,0])
	const [selectedCellData, setSelectedCellData] = useState<string>("")
	const [selectedCellType, setSelectedCellType] = useState<DataType>('string')

	const { theme } = useTheme();

	useEffect(()=>{
		readTableData()
	},[])

	useEffect(()=>{
		if(tableData){
			setCellWidth(tableData.headers.map(({ name, datatype }) => {
				if(datatype == 'string' && name.length > 15){
					return name.length * 8
				}
				return 100
			}))
		}

	},[tableData])

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
			<View style={{ height: 70, justifyContent: 'center'}}>
				<Text style={{textAlign: 'center', alignSelf: 'center'}}>{cellData}</Text>
			</View>
		</TouchableOpacity>
	}

	const changeTableOperation = () =>{
		const newTable = JSON.parse(JSON.stringify(tableData))
		if(newTable != undefined){
			console.log("Selected")
			newTable.table[selectedCollum][selectedRow] = selectedCellData
			writeTableData(newTable)
		}else{
			throw new Error("O clone da tabela resultou em undefined")
		}
	}
	const addRow = () => {
		const newTable: TableType = JSON.parse(JSON.stringify(tableData))
		if(newTable != undefined){
			const newRow = newTable.headers.map(({ datatype }) => datatype == 'number' ? '0' : '')
			newTable.table.push(newRow)
			writeTableData(newTable)
		}else{
			throw new Error("O clone da tabela resultou em undefined")
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<Text h4> {shableId} </Text>
			{tableData && <>
				<ScrollView horizontal={true}>
					<View style={{marginTop: 20}}>
						<Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
							{/*widthArr={state.widthArr} can be used to set header sizes*/}
							<Row data={tableData.headers.map(v => v.name)}
								style={{ height: 50, backgroundColor: theme.colors.primary }}
								widthArr={cellWidth}
								textStyle={{ textAlign: 'center', fontWeight: '300', color: 'black' }}
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
										style={{width: cellWidth[cellIndex]}}
									/>
								))}
								</TableWrapper>
							))}
							</Table>
						</ScrollView>
					</View>
				</ScrollView>
				<FAB 
					color={theme.colors.primary}
					icon={{ name: 'add', color: 'white' }}
					placement='right'
					size='large'
					onPress={addRow}
				/>
				</>}
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
	container: { flex: 1, paddingLeft: 3, paddingTop: 30, backgroundColor: '#fff' },
	header: { height: 50, backgroundColor: '#537791' },
	dataWrapper: { marginTop: -1 },
	row: { flexDirection:'row',backgroundColor: '#E7E6E1' },
  });