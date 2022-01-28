/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    checkDuplicateDocumentsQuery,
    documentHeaderQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query documentHeader(input) : [DocumentHeader]
const documentHeader = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = documentHeaderQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())           ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())           ?   args.LANG.trim()          : '',
            (typeof args.DOCID !== 'undefined' && args.DOCID.trim())         ?   args.DOCID.trim()         : ''
        ];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        //console.log(result);

        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}




/**
 * CRUD Operations for DocHeaders
 **/
// Resolver function for mutation DocHeadersCRUDOps(input) : String
const DocHeadersCRUDOps = async (args, context, info) =>
{
    try 
    {    
        loginUser = validations.getLoginData(context);
                            
        // Get the transaction from arguments
        let transaction = args.transaction;

        let affectedRecords = 0;

        // If transaction is not available
        if(typeof transaction === 'undefined' || transaction.trim().length == 0)
            throw new Error("Transaction is required and can not be empty.");

        transaction = transaction.trim().toUpperCase();    
        
        if(transaction == "CREATE")     // Create 
        {

            // Validate input data
            let docHeaders = await validateCREATEData(args.docHeaders);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateDocHeaders(docHeaders);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createDocHeaders(docHeaders);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let docHeaders = await validateUPDATEData(args.docHeaders);

            // Check availability of records
            let duplicateObj =  await checkDuplicateDocHeaders(docHeaders);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != docHeaders.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateDocHeaders(docHeaders);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let docHeaders = await validateDELETEData(args.docHeaders);

            // Check availability of records
            let duplicateObj =  await checkDuplicateDocHeaders(docHeaders);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != docHeaders.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteDocHeaders(docHeaders);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let docHeaders = await validateDELETEData(args.docHeaders);

            // Check availability of records
            let duplicateObj =  await checkDuplicateDocHeaders(docHeaders);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != docHeaders.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteDocHeaders(docHeaders);
            }

        }
        else    // Throw invalid transaction error
        {
            throw new Error("Invalid transaction specified.");
        }

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }

}



// Validation funtion for creation
const validateCREATEData = async (docHeaders) =>
{
    try 
    {
        let validationObjects = {};
        
        for(let i = 0; i < docHeaders.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", docHeaders[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", docHeaders[i].LANG, "Language is required", validationObject);
            validations.checkNull("CURRENCY", docHeaders[i].CURRENCY, "Select Currency", validationObject);
            validations.checkNull("DOCHDR", docHeaders[i].DOCHDR, "Header is required", validationObject);
            validations.checkNull("CUSTCD", docHeaders[i].CUSTCD, "Select Customer", validationObject);
            validations.checkNull("DUEDT", docHeaders[i].DUEDT, "Due date is required", validationObject);
            validations.checkNull("RMKS", docHeaders[i].RMKS, "Remarks are required", validationObject);
            validations.checkNull("DOCDT", docHeaders[i].DOCDT, "Invoice date is required", validationObject);
            validations.checkNull("DOCNO", docHeaders[i].DOCNO, "Invoice no is required", validationObject);
            validations.checkNull("DOCID", docHeaders[i].DOCID, "Doc ID is required", validationObject);
            validations.checkNull("CMPN", docHeaders[i].CMPN, "Company is required", validationObject);

            validations.checkMaxLength("DOCHDR", docHeaders[i].DOCHDR, 200, "Length of Header should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("CUSTCD", docHeaders[i].CUSTCD, 120, "Length of Customer should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("RMKS", docHeaders[i].RMKS, 120, "Length of Remarks should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("DOCNO", docHeaders[i].DOCNO, 10, "Length of Invoice no should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DOCID", docHeaders[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CMPN", docHeaders[i].CMPN, 4, "Length of Company should be less than or equal to 4 characters", validationObject);

            // Check dates validations pending
            if(Object.keys(validationObject).length == 0)
                validations.isDateGreater("DOCDT", docHeaders[i].DOCDT, "DUEDT", docHeaders[i].DUEDT, "Invoice date should be less than Due date", validationObject); 

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }

        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        { 
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i = 0; i < docHeaders.length; i++)
            {
                
                // Add create params 
                docHeaders[i].CDATE = curDate;
                docHeaders[i].CTIME = curTime;
                docHeaders[i].ISDEL = "N";
                docHeaders[i].CUSER = loginUser.USERID.toLowerCase();

            }
        
            return docHeaders;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (docHeaders) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < docHeaders.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", docHeaders[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", docHeaders[i].LANG, "Language is required", validationObject);
            validations.checkNull("CURRENCY", docHeaders[i].CURRENCY, "Select Currency", validationObject);
            validations.checkNull("DOCHDR", docHeaders[i].DOCHDR, "Header is required", validationObject);
            validations.checkNull("CUSTCD", docHeaders[i].CUSTCD, "Select Customer", validationObject);
            validations.checkNull("DUEDT", docHeaders[i].DUEDT, "Due date is required", validationObject);
            validations.checkNull("RMKS", docHeaders[i].RMKS, "Remarks are required", validationObject);
            validations.checkNull("DOCDT", docHeaders[i].DOCDT, "Invoice date is required", validationObject);
            validations.checkNull("DOCNO", docHeaders[i].DOCNO, "Invoice no is required", validationObject);
            validations.checkNull("DOCID", docHeaders[i].DOCID, "Doc ID is required", validationObject);
            validations.checkNull("CMPN", docHeaders[i].CMPN, "Company is required", validationObject);

            validations.checkMaxLength("DOCHDR", docHeaders[i].DOCHDR, 200, "Length of Header should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("CUSTCD", docHeaders[i].CUSTCD, 120, "Length of Customer should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("RMKS", docHeaders[i].RMKS, 120, "Length of Remarks should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("DOCNO", docHeaders[i].DOCNO, 10, "Length of Invoice no should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DOCID", docHeaders[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CMPN", docHeaders[i].CMPN, 4, "Length of Company should be less than or equal to 4 characters", validationObject);

            // Check dates validations pending
            if(Object.keys(validationObject).length == 0)
                validations.isDateGreater("DOCDT", docHeaders[i].DOCDT, "DUEDT", docHeaders[i].DUEDT, "Invoice date should be less than Due date", validationObject); 

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        {
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i=0; i<docHeaders.length; i++)
            {                
                // Add update params 
                docHeaders[i].UDATE = curDate;
                docHeaders[i].UTIME = curTime;
                docHeaders[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return docHeaders;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (docHeaders) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < docHeaders.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", docHeaders[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", docHeaders[i].LANG, "Language is required", validationObject);
            validations.checkNull("DOCID", docHeaders[i].DOCID, "Doc ID is required", validationObject);

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        {
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i=0; i<docHeaders.length; i++)
            {                
                // Add delete params 
                docHeaders[i].DDATE = curDate;
                docHeaders[i].DTIME = curTime;
                docHeaders[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return docHeaders;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateDocHeaders = async (docHeaders) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;

        for(let i = 0; i < docHeaders.length; i++)
        {
            placeHolders = [
                (typeof docHeaders[i].CLNT !== 'undefined' && docHeaders[i].CLNT.trim())        ?   docHeaders[i].CLNT.trim()    : '',
                (typeof docHeaders[i].LANG !== 'undefined' && docHeaders[i].LANG.trim())        ?   docHeaders[i].LANG.trim()    : '',
                (typeof docHeaders[i].DOCID !== 'undefined' && docHeaders[i].DOCID.trim())      ?   docHeaders[i].DOCID.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateDocumentsQuery, placeHolders)
            
            if(parseInt(result[0].COUNT) > 0)
            {
                duplicateRecordsMessage = duplicateRecordsMessage + "Record " + (i+1) + ": Duplicate record found. "; 
                duplicateCount = duplicateCount + 1;       
            }
            else
            {
                recordsNotFoundMessage = recordsNotFoundMessage + "Record " + (i+1) + ": Record not found. ";
            }
    
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
    {
        throw error;    
    }        

}


// function for creating docHeaders records
const createDocHeaders = async (docHeaders) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docHeaders.length; i++)
        {
            // form the data json
            dataJSON = docHeaders[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TDOCHDR", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating docHeaders records
const updateDocHeaders = async (docHeaders) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docHeaders.length; i++)
        {
            // form the data json
            dataJSON = docHeaders[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   docHeaders[i].CLNT,
                "LANG"    :   docHeaders[i].LANG,
                "DOCID"  :	  docHeaders[i].DOCID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TDOCHDR", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for logically deleting docHeaders records
const logicalDeleteDocHeaders = async (docHeaders) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docHeaders.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   docHeaders[i].DDATE,
                "DTIME"	  :   docHeaders[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   docHeaders[i].CLNT,
                "LANG"    :   docHeaders[i].LANG,
                "DOCID"  :	  docHeaders[i].DOCID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TDOCHDR", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting docHeaders records
const physicalDeleteDocHeaders = async (docHeaders) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docHeaders.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   docHeaders[i].CLNT,
                "LANG"    :   docHeaders[i].LANG,
                "DOCID"  :	  docHeaders[i].DOCID
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TDOCHDR", clauseJSON);
            deleteStatements.push(deleteStatement);
            //console.log("deleteStatement => ");  console.log(deleteStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// Export functions
module.exports = {
    DocHeadersCRUDOps,
    validateCREATEData,
    validateDELETEData,
    checkDuplicateDocHeaders,
    documentHeader
};

