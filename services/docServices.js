/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import admZip from 'adm-zip';
import {checkDuplicateDocumentQuery} from '../common/sqlQueries'; 



// Resolver function for query documentDetails(input) : [UploadedDocuments]
const getDocDetail = async (args, context, info) =>
{
    try 
    {
        
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}

// function for creating documents
const createDocument = async (document) =>
{    
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let docIDs = [];
            // form the data json
            dataJSON = document;
            console.log(document);
            dataJSON.CDATE = sysDateTime.sysdate_yyyymmdd();
            dataJSON.CTIME = sysDateTime.systime_hh24mmss();
            dataJSON.ISDEL = 'N';
           // dataJSON.CUSER = loginUser.USERID.toLowerCase()
            // Get the insert statement
            console.log('abc');
            let duplicateObj =  await checkDuplicateDocument(dataJSON);
            

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw document;
            }
            else
            {
            insertStatement = await dbServices.getInsertStatement("TMASTERDOCS", dataJSON);
            console.log(insertStatement);
            insertStatements.push(insertStatement);
            affectedRecords = await dbServices.executeDMLTransactions(insertStatements);
            }
        // Use db service to execute DML transactions
        

        //return affectedRecords;        
        return document;        

    } 
    catch (error) 
    {
        throw error;    
    }
}


const deleteDocument = async (document) =>
{
    


    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   sysDateTime.sysdate_yyyymmdd(),
                "DTIME"	  :   sysDateTime.systime_hh24mmss(),
                //"DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   document.CLNT,
                "LANG"    :   document.LANG,
                "DOCID"   :	  document.DOCID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TMASTERDOCS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return document;        
    } 
    catch (error) 
    {
        throw error;    
    }

   
}



const checkDuplicateDocument = async (document) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        
            placeHolders = [
                (typeof document.CLNT !== 'undefined' && document.CLNT.trim())        ?   document.CLNT.trim()    : '',
                (typeof document.LANG !== 'undefined' && document.LANG.trim())        ?   document.LANG.trim()    : '',
                (typeof document.DOCID !== 'undefined' && document.DOCID.trim())      ?   document.DOCID.trim()     : ''
            ];
            console.log(checkDuplicateDocumentQuery);
            result = await dbServices.getTableData(checkDuplicateDocumentQuery, placeHolders)
            console.log(result);
            
            if(parseInt(result[0].COUNT) > 0)
            {
                duplicateRecordsMessage = duplicateRecordsMessage + "Record " + (1) + ": Duplicate record found. "; 
                duplicateCount = duplicateCount + 1;       
            }
            else
            {
                recordsNotFoundMessage = recordsNotFoundMessage + "Record " + (1) + ": Record not found. ";
            }
    
       
        
        // if duplicate records found
        if(parseInt(duplicateCount) != 0)
        {
            return {
                isDuplicate : true,
                duplicateRecordsMessage : duplicateRecordsMessage,          // For duplicate records
                recordsNotFoundMessage : recordsNotFoundMessage,            // For unavailable records
                duplicateCount : duplicateCount
            };
        }
        {
            return {
                isDuplicate : false,
                duplicateRecordsMessage : "",
                recordsNotFoundMessage : recordsNotFoundMessage,            // For unavailable records
                duplicateCount : duplicateCount
            };
        }        
    } 
    catch (error) 
    {console.log(error);
        throw error;    
    }        

}


// Export functions
module.exports = {
    createDocument,
    deleteDocument,
    getDocDetail
};
