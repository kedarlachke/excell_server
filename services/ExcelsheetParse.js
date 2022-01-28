import dbservices from './dbServices';
import XLSX from 'xlsx'


const parseExcel=async(append,workbook)=>{
//var workbook = XLSX.readFile('./excel-to-json.xlsx');
//console.log(workbook)
for(let i=0;i<workbook.SheetNames.length;i++){
console.log("-------------->" + workbook.SheetNames[i])
let sheetjsonarr=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]])
var sheetfirstobj=sheetjsonarr[0]
//console.log(obj)
var keys=Object.keys(sheetfirstobj)
for(var k=0;k<sheetjsonarr.length;k++){
    for(var j=0;j< keys.length;j++){
        if(keys[j].includes(' ')){
            var newkey=keys[j].replace(/\s/g,"_")
            sheetjsonarr[k][newkey]=sheetjsonarr[k][keys[j]]
            delete sheetjsonarr[k][keys[j]]
        }
    }
}
console.log(Object.keys(sheetjsonarr[0]))
//createTableFromKey(workbook.SheetNames[i],console.log(sheetjsonarr)
let res=await dbservices.checkIfTableExist(workbook.SheetNames[i])
console.log('--------------------------'+res[0].COUNT)
if(res[0].COUNT>0 && !append){
console.log(1)
    let tableDLL=`DROP TABLE ${workbook.SheetNames[i]}`
    await dbservices.DropTable(tableDLL)
    await dbservices.createTableFromKey(workbook.SheetNames[i],Object.keys(sheetjsonarr[0]))
    await dbservices.getInsertStatements(workbook.SheetNames[i],sheetjsonarr)
}else if(res[0].COUNT>0 && append){
    console.log(2)
    await dbservices.getInsertStatements(workbook.SheetNames[i],sheetjsonarr)
    
}else{
    console.log(3)
    await dbservices.createTableFromKey(workbook.SheetNames[i],Object.keys(sheetjsonarr[0]))
    await dbservices.getInsertStatements(workbook.SheetNames[i],sheetjsonarr) 
}


}

}



// const createTableFromKey=(tableName,keys)=>{
//     //console.log('123')
//     let column="";
//     for(let i=0;i<keys.length;i++){
//         if(i==keys.length-1){
//             column=column+keys[i].toLocaleUpperCase()+" VARCHAR(100) DEFAULT NULL"
//         }else{
//         column=column+keys[i].toLocaleUpperCase()+" VARCHAR(100) DEFAULT NULL,"}
//     }
//     let createtable=`CREATE TABLE ${tableName} (${column})`
//     console.log(createtable)

// }

// const getInsertStatements = async (tableName, sheetjsonarr) =>
// {
//     let insertStatements = [] 
//     try 
//     { let initdataJSON=sheetjsonarr[0]
//         let initStatement = "INSERT INTO " + tableName + "(";

//         // Get the data json destructured for column names
//         for(let key in initdataJSON) 
//         { 
//             //condition changed 20181030
//             if(initdataJSON[key] && key!='__rowNum__')
//             {
//                 initStatement = initStatement + key + ", ";
//             }
//             //console.log("Key: " + key + " value: " + initdataJSON[key]);
//         }

//         // remove the extra ',' from statement
//         initStatement = initStatement.substring(0, initStatement.lastIndexOf(","));

//         for(let i=0;i<sheetjsonarr.length;i++){
//             let dataJSON=sheetjsonarr[i]
//         // if table name is not available, throw error
//         if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
//             throw new Error("table name is required and can not be empty.");


//         // if values are not available, throw error
//         if(typeof dataJSON === 'undefined' || Object.keys(dataJSON).length == 0 ) 
//             throw new Error("data json is required and can not be empty.");


//          let insertStatement = initStatement;

//         insertStatement = insertStatement + ") VALUES (";
//         // Get the data json destructured for coulmn values
//         for(let key in dataJSON) 
//         { 
//             //insertStatement = insertStatement + "'" + dataJSON[key] + "', ";//20181029
            
//             if(dataJSON[key] && key!='__rowNum__')
//             {
//                 insertStatement = insertStatement + "'" + (dataJSON[key]+'').replace(/'/g, "''") + "', ";
//             }
//             //console.log("Key: " + key + " value: " + dataJSON[key]);
//         }

//         // remove the extra ',' from statement
//         insertStatement = insertStatement.substring(0, insertStatement.lastIndexOf(","));
        
//         insertStatement = insertStatement + ")";
//         insertStatements.push(insertStatement)
//         //return await insertStatement;
//     }
//     console.log(insertStatements)
//     return insertStatements
//     } 
//     catch (error) 
//     {
//         console.log("Error : ");
//         console.log(error);
        
//         throw error;        
//     }
// }
 //parseExcel(true)

 module.exports={
    parseExcel
 }