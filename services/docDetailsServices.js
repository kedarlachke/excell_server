/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    checkDuplicateDocumentItemsQuery,
    documentDetailsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query documentDetails(input) : [DocumentDetails]
const documentDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = documentDetailsQuery;

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
 * CRUD Operations for DocDetails
 **/
// Resolver function for mutation DocDetailsCRUDOps(input) : String
const DocDetailsCRUDOps = async (args, context, info) =>
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
            let docDetails = await validateCREATEData(args.docDetails);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateDocDetails(docDetails);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createDocDetails(docDetails);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let docDetails = await validateUPDATEData(args.docDetails);

            // Check availability of records
            let duplicateObj =  await checkDuplicateDocDetails(docDetails);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != docDetails.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateDocDetails(docDetails);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let docDetails = await validateDELETEData(args.docDetails);

            // Check availability of records
            let duplicateObj =  await checkDuplicateDocDetails(docDetails);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != docDetails.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteDocDetails(docDetails);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let docDetails = await validateDELETEData(args.docDetails);

            // Check availability of records
            let duplicateObj =  await checkDuplicateDocDetails(docDetails);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != docDetails.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteDocDetails(docDetails);
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
const validateCREATEData = async (docDetails) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < docDetails.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", docDetails[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", docDetails[i].LANG, "Language is required", validationObject);
            validations.checkNull("PARTDESC", docDetails[i].PARTDESC, "Service is required", validationObject);
            validations.checkNull("AMOUNT", docDetails[i].AMOUNT, "Amount is required", validationObject);
            validations.checkNull("DOCID", docDetails[i].DOCID, "Doc ID is required", validationObject);

            validations.checkMaxLength("PARTDESC", docDetails[i].PARTDESC, 200, "Length of Service should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("AMOUNT", docDetails[i].AMOUNT, 14, "Length of Amount should be less than or equal to 14 characters", validationObject);
            validations.checkMaxLength("DOCID", docDetails[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);

            // Check dates validations pending

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
            
            for(let i = 0; i < docDetails.length; i++)
            {
                
                // Add create params 
                docDetails[i].CDATE = curDate;
                docDetails[i].CTIME = curTime;
                docDetails[i].ISDEL = "N";
                docDetails[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return docDetails;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (docDetails) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < docDetails.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", docDetails[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", docDetails[i].LANG, "Language is required", validationObject);
            validations.checkNull("PARTDESC", docDetails[i].PARTDESC, "Service is required", validationObject);
            validations.checkNull("AMOUNT", docDetails[i].AMOUNT, "Amount is required", validationObject);
            validations.checkNull("DOCID", docDetails[i].DOCID, "Doc ID is required", validationObject);

            validations.checkMaxLength("PARTDESC", docDetails[i].PARTDESC, 200, "Length of Service should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("AMOUNT", docDetails[i].AMOUNT, 14, "Length of Amount should be less than or equal to 14 characters", validationObject);
            validations.checkMaxLength("DOCID", docDetails[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);

            // Check dates validations pending

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
            
            for(let i=0; i<docDetails.length; i++)
            {                
                // Add update params 
                docDetails[i].UDATE = curDate;
                docDetails[i].UTIME = curTime;
                docDetails[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return docDetails;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (docDetails) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < docDetails.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", docDetails[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", docDetails[i].LANG, "Language is required", validationObject);
            validations.checkNull("DOCID", docDetails[i].DOCID, "Doc ID is required", validationObject);

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
            
            for(let i=0; i<docDetails.length; i++)
            {                
                // Add delete params 
                docDetails[i].DDATE = curDate;
                docDetails[i].DTIME = curTime;
                docDetails[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return docDetails;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateDocDetails = async (docDetails) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < docDetails.length; i++)
        {
            placeHolders = [
                (typeof docDetails[i].CLNT !== 'undefined' && docDetails[i].CLNT.trim())        ?   docDetails[i].CLNT.trim()    : '',
                (typeof docDetails[i].LANG !== 'undefined' && docDetails[i].LANG.trim())        ?   docDetails[i].LANG.trim()    : '',
                (typeof docDetails[i].DOCID !== 'undefined' && docDetails[i].DOCID.trim())      ?   docDetails[i].DOCID.trim()   : '',
                (typeof docDetails[i].LINEITEMNO !== 'undefined' && docDetails[i].LINEITEMNO.trim())      ?   docDetails[i].LINEITEMNO.trim()   : ''

            ];
    
            result = await dbServices.getTableData(checkDuplicateDocumentItemsQuery, placeHolders);
            
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


// function for creating docDetails records
const createDocDetails = async (docDetails) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docDetails.length; i++)
        {
            // form the data json
            dataJSON = docDetails[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TDOCDTL", dataJSON);
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


// function for updating docDetails records
const updateDocDetails = async (docDetails) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docDetails.length; i++)
        {
            // form the data json
            dataJSON = docDetails[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   docDetails[i].CLNT,
                "LANG"    :   docDetails[i].LANG,
                "DOCID"   :	  docDetails[i].DOCID,
                "LINEITEMNO" : docDetails[i].LINEITEMNO
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TDOCDTL", dataJSON, clauseJSON);
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


// function for logically deleting docDetails records
const logicalDeleteDocDetails = async (docDetails) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docDetails.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   docDetails[i].DDATE,
                "DTIME"	  :   docDetails[i].DTIME,
                "DUSER"   : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   docDetails[i].CLNT,
                "LANG"    :   docDetails[i].LANG,
                "DOCID"  :	  docDetails[i].DOCID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TDOCDTL", dataJSON, clauseJSON);
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


// function for phyically deleting docDetails records
const physicalDeleteDocDetails = async (docDetails) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < docDetails.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   docDetails[i].CLNT,
                "LANG"    :   docDetails[i].LANG,
                "DOCID"  :	  docDetails[i].DOCID
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TDOCDTL", clauseJSON);
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
    DocDetailsCRUDOps,
    validateCREATEData,
    checkDuplicateDocDetails,
    documentDetails
};



