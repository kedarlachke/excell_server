/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';


import {
    getECheckAuthorizationDetailsQuery,
    getCardAuthorizationDetailsQuery,
    getCashAuthorizationDetailsQuery,
    checkDuplicateECheckAuthorizationQuery,
    checkDuplicateCardAuthorizationQuery,
    checkDuplicateCashAuthorizationQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


/***------------------- Query Section ------------------ */

// Resolver function for query eCheckAuthorizationDetails(input) : [eCheckAuthorization]
const eCheckAuthorizationDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getECheckAuthorizationDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())    ?   args.CIDSYS.trim()         : ''
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


// Resolver function for query CardAuthorizationDetails(input) : [CardAuthorization]
const CardAuthorizationDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getCardAuthorizationDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())    ?   args.CIDSYS.trim()         : ''
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


// Resolver function for query CashAuthorizationDetails(input) : [CardAuthorization]
const CashAuthorizationDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getCashAuthorizationDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())    ?   args.CIDSYS.trim()         : ''
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


/***------------------- Mutation Section ------------------ */

/**
 * CRUD Operations for eCheck Authorization
 **/
// Resolver function for mutation eCheckAuthorizationCRUDOps(input) : String
const eCheckAuthorizationCRUDOps = async (args, context, info) =>
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
            let authorizations = await validateCREATEECheckData(args.authorizations);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateEChecks(authorizations);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createEChecks(authorizations);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let authorizations = await validateUPDATEECheckData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateEChecks(authorizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateEChecks(authorizations);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let authorizations = await validateDELETEECheckData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateEChecks(authorizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteECheks(authorizations);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let authorizations = await validateDELETEECheckData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateEChecks(authorizations);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteEChecks(authorizations);
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
const validateCREATEECheckData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("CLNTNAME", authorizations[i].CLNTNAME, "Name of Client is required", validationObject);
            validations.checkNull("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, "Name of account holder is required", validationObject);
            validations.checkNull("CLNTADDRFLBANK", authorizations[i].CLNTADDRFLBANK, "Client address on file w/bank is required", validationObject);
            validations.checkNull("BANKNAME", authorizations[i].BANKNAME, "Bank Name is required", validationObject);
            validations.checkNull("BANKACCNO", authorizations[i].BANKACCNO, "Bank account number is required", validationObject);
            validations.checkNull("BANKROUTNO", authorizations[i].BANKROUTNO, "Bank routing number is required", validationObject);
            validations.checkNull("AMTAUTHRZD", authorizations[i].AMTAUTHRZD, "Amount Authorized is required", validationObject);
            validations.checkNull("TODAYDATE", authorizations[i].TODAYDATE, "Today's Date is required", validationObject);
            validations.checkNull("PAYFOR", authorizations[i].PAYFOR, "Payment For is required", validationObject);
            
            if(authorizations[i].AGREE == "N")
                validations.checkNull("AGREE", null, "Select agreement", validationObject);
            
            validations.checkMaxLength("CLNTNAME", authorizations[i].CLNTNAME, 150, "Length of Name of Client should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, 150, "Length of Name of account holder should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CLNTADDRFLBANK", authorizations[i].CLNTADDRFLBANK, 300, "Length of Client address on file w/bank should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("BANKNAME", authorizations[i].BANKNAME, 150, "Length of Bank Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BANKACCNO", authorizations[i].BANKACCNO, 30, "Length of Bank account number should be less than or equal to 30 characters", validationObject);
            validations.checkMaxLength("BANKROUTNO", authorizations[i].BANKROUTNO, 30, "Length of Bank routing number should be less than or equal to 30 characters", validationObject);

            validations.checkNumber("AMTAUTHRZD", authorizations[i].AMTAUTHRZD, "Amount Authorized should be a number", validationObject);
            validations.checkNumber("FEE", authorizations[i].FEE, "Fee should be a number", validationObject);
            validations.checkNumber("BANKACCNO", authorizations[i].BANKACCNO, "Bank account number should be a number", validationObject);
            validations.checkNumber("BANKROUTNO", authorizations[i].BANKROUTNO, "Bank routing number should be a number", validationObject);

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
            
            for(let i = 0; i < authorizations.length; i++)
            {
                // Add create params 
                authorizations[i].CDATE = curDate;
                authorizations[i].CTIME = curTime;
                authorizations[i].ISDEL = "N";
                authorizations[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEECheckData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("CLNTNAME", authorizations[i].CLNTNAME, "Name of Client is required", validationObject);
            validations.checkNull("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, "Name of account holder is required", validationObject);
            validations.checkNull("CLNTADDRFLBANK", authorizations[i].CLNTADDRFLBANK, "Client address on file w/bank is required", validationObject);
            validations.checkNull("BANKNAME", authorizations[i].BANKNAME, "Bank Name is required", validationObject);
            validations.checkNull("BANKACCNO", authorizations[i].BANKACCNO, "Bank account number is required", validationObject);
            validations.checkNull("BANKROUTNO", authorizations[i].BANKROUTNO, "Bank routing number is required", validationObject);
            validations.checkNull("AMTAUTHRZD", authorizations[i].AMTAUTHRZD, "Amount Authorized is required", validationObject);
            validations.checkNull("TODAYDATE", authorizations[i].TODAYDATE, "Today's Date is required", validationObject);
            validations.checkNull("PAYFOR", authorizations[i].PAYFOR, "Payment For is required", validationObject);
            
            if(authorizations[i].AGREE == "N")
                validations.checkNull("AGREE", null, "Select agreement", validationObject);
            
            validations.checkMaxLength("CLNTNAME", authorizations[i].CLNTNAME, 150, "Length of Name of Client should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, 150, "Length of Name of account holder should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CLNTADDRFLBANK", authorizations[i].CLNTADDRFLBANK, 300, "Length of Client address on file w/bank should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("BANKNAME", authorizations[i].BANKNAME, 150, "Length of Bank Name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BANKACCNO", authorizations[i].BANKACCNO, 30, "Length of Bank account number should be less than or equal to 30 characters", validationObject);
            validations.checkMaxLength("BANKROUTNO", authorizations[i].BANKROUTNO, 30, "Length of Bank routing number should be less than or equal to 30 characters", validationObject);

            validations.checkNumber("AMTAUTHRZD", authorizations[i].AMTAUTHRZD, "Amount Authorized should be a number", validationObject);
            validations.checkNumber("FEE", authorizations[i].FEE, "Fee should be a number", validationObject);
            validations.checkNumber("BANKACCNO", authorizations[i].BANKACCNO, "Bank account number should be a number", validationObject);
            validations.checkNumber("BANKROUTNO", authorizations[i].BANKROUTNO, "Bank routing number should be a number", validationObject);

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
            
            for(let i=0; i<authorizations.length; i++)
            {                
                // Add update params 
                authorizations[i].UDATE = curDate;
                authorizations[i].UTIME = curTime;
                authorizations[i].UUSER = loginUser.USERID.toLowerCase();        
        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEECheckData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);

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
            
            for(let i=0; i<authorizations.length; i++)
            {                
                // Add delete params 
                authorizations[i].DDATE = curDate;
                authorizations[i].DTIME = curTime;
                authorizations[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateEChecks = async (authorizations) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < authorizations.length; i++)
        {
            placeHolders = [
                (typeof authorizations[i].CLNT !== 'undefined' && authorizations[i].CLNT.trim())        ?   authorizations[i].CLNT.trim()    : '',
                (typeof authorizations[i].LANG !== 'undefined' && authorizations[i].LANG.trim())        ?   authorizations[i].LANG.trim()    : '',
                (typeof authorizations[i].CIDSYS !== 'undefined' && authorizations[i].CIDSYS.trim())      ?   authorizations[i].CIDSYS.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateECheckAuthorizationQuery, placeHolders)
            
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


// function for creating eChecks records
const createEChecks = async (authorizations) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = authorizations[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("ECHECKAUTH", dataJSON);
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


// function for updating eChecks records
const updateEChecks = async (authorizations) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = authorizations[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("ECHECKAUTH", dataJSON, clauseJSON);
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


// function for logically deleting eChecks records
const logicalDeleteECheks = async (authorizations) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   authorizations[i].DDATE,
                "DTIME"	  :   authorizations[i].DTIME,
                "DUSER"   : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("ECHECKAUTH", dataJSON, clauseJSON);
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


// function for phyically deleting eChecks records
const physicalDeleteEChecks = async (authorizations) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("ECHECKAUTH", clauseJSON);
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


/**
 * CRUD Operations for Card Authorization
 **/
// Resolver function for mutation CardAuthorizationCRUDOps(input) : String
const CardAuthorizationCRUDOps = async (args, context, info) =>
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
            let authorizations = await validateCREATECardData(args.authorizations);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCards(authorizations);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCards(authorizations);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let authorizations = await validateUPDATECardData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCards(authorizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCards(authorizations);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let authorizations = await validateDELETECardData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCards(authorizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCards(authorizations);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let authorizations = await validateDELETECardData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCards(authorizations);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCards(authorizations);
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
const validateCREATECardData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("BILLINGADDR", authorizations[i].BILLINGADDR, "Billing Address is required", validationObject);
            validations.checkNull("EXPDATE", authorizations[i].EXPDATE, "Expiration Date is required", validationObject);
            validations.checkNull("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, "Name of Cardholder is required", validationObject);
            validations.checkNull("CARDTYP", authorizations[i].CARDTYP, "Card Type is required", validationObject);
            validations.checkNull("SECURITYCD", authorizations[i].SECURITYCD, "Security Code is required", validationObject);
            validations.checkNull("CARDNO", authorizations[i].CARDNO, "Card Number is required", validationObject);
            validations.checkNull("CLNTNAME", authorizations[i].CLNTNAME, "Name of Customer is required", validationObject);
            validations.checkNull("TODAYDATE", authorizations[i].TODAYDATE, "Today's Date is required", validationObject);
            validations.checkNull("PAYFOR", authorizations[i].PAYFOR, "Payment For is required", validationObject);
            validations.checkNull("AMOUNT", authorizations[i].AMOUNT, "Amount is required", validationObject);

            if(authorizations[i].AGREE == "N")
                validations.checkNull("AGREE", null, "Select agreement", validationObject);
            
            validations.checkMaxLength("CLNTNAME", authorizations[i].CLNTNAME, 150, "Length of Name of Customer should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, 150, "Length of Name of Cardholder should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BILLINGADDR", authorizations[i].BILLINGADDR, 300, "Length of Billing address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("AMOUNT", authorizations[i].AMOUNT, 100, "Length of Amount should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SECURITYCD", authorizations[i].SECURITYCD, 50, "Length of Security Code should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CARDNO", authorizations[i].CARDNO, 50, "Length of Card Number should be less than or equal to 50 characters", validationObject);

            validations.checkNumber("CARDNO", authorizations[i].CARDNO, "Card Number should be a number", validationObject);

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
            
            for(let i = 0; i < authorizations.length; i++)
            {
                // Add create params 
                authorizations[i].CDATE = curDate;
                authorizations[i].CTIME = curTime;
                authorizations[i].ISDEL = "N";
                authorizations[i].CUSER = loginUser.USERID.toLowerCase();        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATECardData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("BILLINGADDR", authorizations[i].BILLINGADDR, "Billing Address is required", validationObject);
            validations.checkNull("EXPDATE", authorizations[i].EXPDATE, "Expiration Date is required", validationObject);
            validations.checkNull("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, "Name of Cardholder is required", validationObject);
            validations.checkNull("CARDTYP", authorizations[i].CARDTYP, "Card Type is required", validationObject);
            validations.checkNull("SECURITYCD", authorizations[i].SECURITYCD, "Security Code is required", validationObject);
            validations.checkNull("CARDNO", authorizations[i].CARDNO, "Card Number is required", validationObject);
            validations.checkNull("CLNTNAME", authorizations[i].CLNTNAME, "Name of Customer is required", validationObject);
            validations.checkNull("TODAYDATE", authorizations[i].TODAYDATE, "Today's Date is required", validationObject);
            validations.checkNull("PAYFOR", authorizations[i].PAYFOR, "Payment For is required", validationObject);
            validations.checkNull("AMOUNT", authorizations[i].AMOUNT, "Amount is required", validationObject);

            if(authorizations[i].AGREE == "N")
                validations.checkNull("AGREE", null, "Select agreement", validationObject);
            
            validations.checkMaxLength("CLNTNAME", authorizations[i].CLNTNAME, 150, "Length of Name of Customer should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ACCHLDRNAME", authorizations[i].ACCHLDRNAME, 150, "Length of Name of Cardholder should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("BILLINGADDR", authorizations[i].BILLINGADDR, 300, "Length of Billing address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("AMOUNT", authorizations[i].AMOUNT, 100, "Length of Amount should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("SECURITYCD", authorizations[i].SECURITYCD, 50, "Length of Security Code should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("CARDNO", authorizations[i].CARDNO, 50, "Length of Card Number should be less than or equal to 50 characters", validationObject);

            validations.checkNumber("CARDNO", authorizations[i].CARDNO, "Card Number should be a number", validationObject);

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
            
            for(let i=0; i<authorizations.length; i++)
            {                
                // Add update params 
                authorizations[i].UDATE = curDate;
                authorizations[i].UTIME = curTime;
                authorizations[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETECardData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);

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
            
            for(let i=0; i<authorizations.length; i++)
            {                
                // Add delete params 
                authorizations[i].DDATE = curDate;
                authorizations[i].DTIME = curTime;
                authorizations[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateCards = async (authorizations) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < authorizations.length; i++)
        {
            placeHolders = [
                (typeof authorizations[i].CLNT !== 'undefined' && authorizations[i].CLNT.trim())        ?   authorizations[i].CLNT.trim()    : '',
                (typeof authorizations[i].LANG !== 'undefined' && authorizations[i].LANG.trim())        ?   authorizations[i].LANG.trim()    : '',
                (typeof authorizations[i].CIDSYS !== 'undefined' && authorizations[i].CIDSYS.trim())      ?   authorizations[i].CIDSYS.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateCardAuthorizationQuery, placeHolders)
            
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


// function for creating Cards records
const createCards = async (authorizations) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = authorizations[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("CARDAUTH", dataJSON);
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


// function for updating Cards records
const updateCards = async (authorizations) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = authorizations[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CARDAUTH", dataJSON, clauseJSON);
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


// function for logically deleting Cards records
const logicalDeleteCards = async (authorizations) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   authorizations[i].DDATE,
                "DTIME"	  :   authorizations[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CARDAUTH", dataJSON, clauseJSON);
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


// function for phyically deleting Cards records
const physicalDeleteCards = async (authorizations) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("CARDAUTH", clauseJSON);
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



/**
 * CRUD Operations for Cash Authorization
 **/
// Resolver function for mutation CashAuthorizationCRUDOps(input) : String
const CashAuthorizationCRUDOps = async (args, context, info) =>
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
            let authorizations = await validateCREATECashData(args.authorizations);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCashAuths(authorizations);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCashAuths(authorizations);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let authorizations = await validateUPDATECashData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCashAuths(authorizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCashAuths(authorizations);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let authorizations = await validateDELETECashData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCashAuths(authorizations);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCashAuths(authorizations);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let authorizations = await validateDELETECashData(args.authorizations);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCashAuths(authorizations);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != authorizations.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCashAuths(authorizations);
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
const validateCREATECashData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("AMOUNT", authorizations[i].AMOUNT, "Amount is required", validationObject);
            validations.checkNull("PAYMENTFOR", authorizations[i].PAYMENTFOR, "Payment For is required", validationObject);
            validations.checkNull("PAYMENTMODE", authorizations[i].PAYMENTMODE, "Payment Mode is required", validationObject);
            
            validations.checkMaxLength("AMOUNT", authorizations[i].AMOUNT, 12, "Length of Amount should be less than or equal to 12 characters", validationObject);
            validations.checkMaxLength("FEE", authorizations[i].FEE, 12, "Length of Fee should be less than or equal to 12 characters", validationObject);

            validations.checkNumber("AMOUNT", authorizations[i].AMOUNT, "Amount should be a number", validationObject);
            validations.checkNumber("FEE", authorizations[i].FEE, "Fee should be a number", validationObject);

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
            
            for(let i = 0; i < authorizations.length; i++)
            {
                // Add create params 
                authorizations[i].CDATE = curDate;
                authorizations[i].CTIME = curTime;
                authorizations[i].ISDEL = "N";
                authorizations[i].CUSER = loginUser.USERID.toLowerCase();
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATECashData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("AMOUNT", authorizations[i].AMOUNT, "Amount is required", validationObject);
            validations.checkNull("PAYMENTFOR", authorizations[i].PAYMENTFOR, "Payment For is required", validationObject);
            validations.checkNull("PAYMENTMODE", authorizations[i].PAYMENTMODE, "Payment Mode is required", validationObject);
            
            validations.checkMaxLength("AMOUNT", authorizations[i].AMOUNT, 12, "Length of Amount should be less than or equal to 12 characters", validationObject);
            validations.checkMaxLength("FEE", authorizations[i].FEE, 12, "Length of Fee should be less than or equal to 12 characters", validationObject);

            validations.checkNumber("AMOUNT", authorizations[i].AMOUNT, "Amount should be a number", validationObject);
            validations.checkNumber("FEE", authorizations[i].FEE, "Fee should be a number", validationObject);

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
            
            for(let i=0; i<authorizations.length; i++)
            {                
                // Add update params 
                authorizations[i].UDATE = curDate;
                authorizations[i].UTIME = curTime;
                authorizations[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETECashData = async (authorizations) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < authorizations.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", authorizations[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", authorizations[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", authorizations[i].CIDSYS, "Case ID is required", validationObject);

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
            
            for(let i=0; i<authorizations.length; i++)
            {                
                // Add delete params 
                authorizations[i].DDATE = curDate;
                authorizations[i].DTIME = curTime;
                authorizations[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return authorizations;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateCashAuths = async (authorizations) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < authorizations.length; i++)
        {
            placeHolders = [
                (typeof authorizations[i].CLNT !== 'undefined' && authorizations[i].CLNT.trim())        ?   authorizations[i].CLNT.trim()    : '',
                (typeof authorizations[i].LANG !== 'undefined' && authorizations[i].LANG.trim())        ?   authorizations[i].LANG.trim()    : '',
                (typeof authorizations[i].CIDSYS !== 'undefined' && authorizations[i].CIDSYS.trim())      ?   authorizations[i].CIDSYS.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateCashAuthorizationQuery, placeHolders)
            
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


// function for creating Cashs records
const createCashAuths = async (authorizations) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = authorizations[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("CASHOTHERPAYMENT", dataJSON);
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


// function for updating Cashs records
const updateCashAuths = async (authorizations) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = authorizations[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CASHOTHERPAYMENT", dataJSON, clauseJSON);
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


// function for logically deleting Cashs records
const logicalDeleteCashAuths = async (authorizations) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   authorizations[i].DDATE,
                "DTIME"	  :   authorizations[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CASHOTHERPAYMENT", dataJSON, clauseJSON);
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


// function for phyically deleting Cashs records
const physicalDeleteCashAuths = async (authorizations) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < authorizations.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   authorizations[i].CLNT,
                "LANG"    :   authorizations[i].LANG,
                "CIDSYS"  :	  authorizations[i].CIDSYS
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("CASHOTHERPAYMENT", clauseJSON);
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
    eCheckAuthorizationDetails,
    CardAuthorizationDetails,
    CashAuthorizationDetails,
    eCheckAuthorizationCRUDOps,
    CardAuthorizationCRUDOps,
    CashAuthorizationCRUDOps
};