/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    checkDuplicateTaxAmountQuery,
    taxDetailsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query taxAmountDetails(input) : [TaxAmount]
const taxAmountDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = taxDetailsQuery;

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
 * CRUD Operations for TaxAmounts
 **/
// Resolver function for mutation TaxAmountsCRUDOps(input) : String
const TaxAmountsCRUDOps = async (args, context, info) =>
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
            let taxAmounts = await validateCREATEData(args.taxAmounts);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateTaxAmounts(taxAmounts);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createTaxAmounts(taxAmounts);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let taxAmounts = await validateUPDATEData(args.taxAmounts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateTaxAmounts(taxAmounts);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != taxAmounts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateTaxAmounts(taxAmounts);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let taxAmounts = await validateDELETEData(args.taxAmounts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateTaxAmounts(taxAmounts);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != taxAmounts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteTaxAmounts(taxAmounts);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let taxAmounts = await validateDELETEData(args.taxAmounts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateTaxAmounts(taxAmounts);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != taxAmounts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteTaxAmounts(taxAmounts);
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
const validateCREATEData = async (taxAmounts) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < taxAmounts.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", taxAmounts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", taxAmounts[i].LANG, "Language is required", validationObject);
            validations.checkNull("DOCID", taxAmounts[i].DOCID, "Doc ID is required", validationObject);
            validations.checkNull("DOCTYPE", taxAmounts[i].DOCTYPE, "Document Type is required", validationObject);
            validations.checkNull("AMOUNT", taxAmounts[i].AMOUNT, "Amount is required", validationObject);
            validations.checkNull("TAXAMOUNT", taxAmounts[i].TAXAMOUNT, "Tax Amount is required", validationObject);

            validations.checkMaxLength("AMOUNT", taxAmounts[i].AMOUNT, 50, "Length of Amount should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("TAXAMOUNT", taxAmounts[i].TAXAMOUNT, 100, "Length of Amount should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DOCID", taxAmounts[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DOCTYPE", taxAmounts[i].DOCTYPE, 10, "Length of Document Type should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("AMOUNT", taxAmounts[i].AMOUNT, "Amount should be a number", validationObject);
            validations.checkNumber("TAXAMOUNT", taxAmounts[i].TAXAMOUNT, "Tax Amount should be a number", validationObject);

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
            
            for(let i = 0; i < taxAmounts.length; i++)
            {
                // Add create params 
                taxAmounts[i].CDATE = curDate;
                taxAmounts[i].CTIME = curTime;
                taxAmounts[i].ISDEL = "N";
                taxAmounts[i].CUSER = loginUser.USERID.toLowerCase();
            }
        
            return taxAmounts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (taxAmounts) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < taxAmounts.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", taxAmounts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", taxAmounts[i].LANG, "Language is required", validationObject);
            validations.checkNull("DOCID", taxAmounts[i].DOCID, "Doc ID is required", validationObject);
            validations.checkNull("DOCTYPE", taxAmounts[i].DOCTYPE, "Document Type is required", validationObject);
            validations.checkNull("AMOUNT", taxAmounts[i].AMOUNT, "Amount is required", validationObject);
            validations.checkNull("TAXAMOUNT", taxAmounts[i].TAXAMOUNT, "Tax Amount is required", validationObject);

            validations.checkMaxLength("AMOUNT", taxAmounts[i].AMOUNT, 50, "Length of Amount should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("TAXAMOUNT", taxAmounts[i].TAXAMOUNT, 100, "Length of Amount should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("DOCID", taxAmounts[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DOCTYPE", taxAmounts[i].DOCTYPE, 10, "Length of Document Type should be less than or equal to 10 characters", validationObject);

            validations.checkNumber("AMOUNT", taxAmounts[i].AMOUNT, "Amount should be a number", validationObject);
            validations.checkNumber("TAXAMOUNT", taxAmounts[i].TAXAMOUNT, "Tax Amount should be a number", validationObject);

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
            
            for(let i=0; i<taxAmounts.length; i++)
            {                
                // Add update params 
                taxAmounts[i].UDATE = curDate;
                taxAmounts[i].UTIME = curTime;
                taxAmounts[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return taxAmounts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (taxAmounts) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < taxAmounts.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", taxAmounts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", taxAmounts[i].LANG, "Language is required", validationObject);
            validations.checkNull("DOCID", taxAmounts[i].DOCID, "Doc ID is required", validationObject);

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
            
            for(let i=0; i<taxAmounts.length; i++)
            {                
                // Add delete params 
                taxAmounts[i].DDATE = curDate;
                taxAmounts[i].DTIME = curTime;
                taxAmounts[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return taxAmounts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateTaxAmounts = async (taxAmounts) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < taxAmounts.length; i++)
        {
            placeHolders = [
                (typeof taxAmounts[i].CLNT !== 'undefined' && taxAmounts[i].CLNT.trim())        ?   taxAmounts[i].CLNT.trim()    : '',
                (typeof taxAmounts[i].LANG !== 'undefined' && taxAmounts[i].LANG.trim())        ?   taxAmounts[i].LANG.trim()    : '',
                (typeof taxAmounts[i].DOCID !== 'undefined' && taxAmounts[i].DOCID.trim())      ?   taxAmounts[i].DOCID.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateTaxAmountQuery, placeHolders)
            
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



// function for creating taxAmounts records
const createTaxAmounts = async (taxAmounts) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < taxAmounts.length; i++)
        {
            // form the data json
            dataJSON = taxAmounts[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TTAXAMOUNT", dataJSON);
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


// function for updating taxAmounts records
const updateTaxAmounts = async (taxAmounts) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < taxAmounts.length; i++)
        {
            // form the data json
            dataJSON = taxAmounts[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   taxAmounts[i].CLNT,
                "LANG"    :   taxAmounts[i].LANG,
                "DOCID"  :	  taxAmounts[i].DOCID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TTAXAMOUNT", dataJSON, clauseJSON);
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


// function for logically deleting taxAmounts records
const logicalDeleteTaxAmounts = async (taxAmounts) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < taxAmounts.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   taxAmounts[i].DDATE,
                "DTIME"	  :   taxAmounts[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   taxAmounts[i].CLNT,
                "LANG"    :   taxAmounts[i].LANG,
                "DOCID"  :	  taxAmounts[i].DOCID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TTAXAMOUNT", dataJSON, clauseJSON);
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


// function for phyically deleting taxAmounts records
const physicalDeleteTaxAmounts = async (taxAmounts) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < taxAmounts.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   taxAmounts[i].CLNT,
                "LANG"    :   taxAmounts[i].LANG,
                "DOCID"  :	  taxAmounts[i].DOCID
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TTAXAMOUNT", clauseJSON);
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
    TaxAmountsCRUDOps,
    validateCREATEData,
    checkDuplicateTaxAmounts,
    taxAmountDetails
};
