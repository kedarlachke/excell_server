/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    searchServicesQuery,
    getServiceDetailsQuery,
    checkDuplicateServiceQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchServices(input) : [Service]
const searchServices = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchServicesQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.STDESC !== 'undefined' && args.STDESC.trim())          ?   args.STDESC.trim()        : '%%'
        ];    
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}



// Resolver function for query serviceDetails(input) : [Service]
const serviceDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getServiceDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.CATCODE !== 'undefined' && args.CATCODE.trim())    ?   args.CATCODE.trim()      : '',
            (typeof args.STCODE !== 'undefined' && args.STCODE.trim())    ?   args.STCODE.trim()         : ''
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
 * CRUD Operations for Services
 **/
// Resolver function for mutation ServicesCRUDOps(input) : String
const ServicesCRUDOps = async (args, context, info) =>
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
            let services = await validateCREATEServicesData(args.services);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateServices(services);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createServices(services);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let services = await validateUPDATEServicesData(args.services);

            // Check availability of records
            let duplicateObj =  await checkDuplicateServices(services);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != services.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateServices(services);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let services = await validateDELETEServicesData(args.services);

            // Check availability of records
            let duplicateObj =  await checkDuplicateServices(services);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != services.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteServices(services);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let services = await validateDELETEServicesData(args.services);

            // Check availability of records
            let duplicateObj =  await checkDuplicateServices(services);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != services.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteServices(services);
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
const validateCREATEServicesData = async (services) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < services.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", services[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", services[i].LANG, "Language is required", validationObject);
            validations.checkNull("CATCODE", services[i].CATCODE, "Select Service", validationObject);
            validations.checkNull("STDESC", services[i].STDESC, "Sub-service is required", validationObject);
            validations.checkNull("ORDERNO", services[i].ORDERNO, "Order no is required", validationObject);
            validations.checkNull("ISACTIVE", services[i].ISACTIVE, "Select Status", validationObject);

            validations.checkMaxLength("STDESC", services[i].STDESC, 100, "Length of Sub-service should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ORDERNO", services[i].ORDERNO, 20, "Length of Order no should be less than or equal to 20 characters", validationObject);

            validations.checkNumber("ORDERNO", services[i].ORDERNO, "Order no should be a number", validationObject);

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
            let nextNumber;
    
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i = 0; i < services.length; i++)
            {
                // Get auto-generated number for services id
                nextNumber = await numberSeries.getNextSeriesNumber(services[i].CLNT, "NA", "SERTYP");
                
                // Add auto-generated number as services id
                services[i].STCODE = nextNumber;                

                // Add create params 
                services[i].CDATE = curDate;
                services[i].CTIME = curTime;
                services[i].ISDEL = "N";
                services[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return services;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEServicesData = async (services) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < services.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", services[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", services[i].LANG, "Language is required", validationObject);
            validations.checkNull("CATCODE", services[i].CATCODE, "Select Service", validationObject);
            validations.checkNull("STCODE", services[i].STCODE, "Sub-service code is required", validationObject);
            validations.checkNull("STDESC", services[i].STDESC, "Sub-service is required", validationObject);
            validations.checkNull("ORDERNO", services[i].ORDERNO, "Order no is required", validationObject);
            validations.checkNull("ISACTIVE", services[i].ISACTIVE, "Select Status", validationObject);

            validations.checkMaxLength("STDESC", services[i].STDESC, 100, "Length of Sub-service should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("ORDERNO", services[i].ORDERNO, 20, "Length of Order no should be less than or equal to 20 characters", validationObject);

            validations.checkNumber("ORDERNO", services[i].ORDERNO, "Order no should be a number", validationObject);

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
            
            for(let i=0; i<services.length; i++)
            {                
                // Add update params 
                services[i].UDATE = curDate;
                services[i].UTIME = curTime;
                services[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return services;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEServicesData = async (services) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < services.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", services[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", services[i].LANG, "Language is required", validationObject);
            validations.checkNull("CATCODE", services[i].CATCODE, "Select Service", validationObject);
            validations.checkNull("STCODE", services[i].STCODE, "Sub-service code is required", validationObject);

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
            
            for(let i=0; i<services.length; i++)
            {                
                // Add delete params 
                services[i].DDATE = curDate;
                services[i].DTIME = curTime;
                services[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return services;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateServices = async (services) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < services.length; i++)
        {
            placeHolders = [
                (typeof services[i].CLNT !== 'undefined' && services[i].CLNT.trim())        ?   services[i].CLNT.trim()    : '',
                (typeof services[i].LANG !== 'undefined' && services[i].LANG.trim())        ?   services[i].LANG.trim()    : '',
                (typeof services[i].CATCODE !== 'undefined' && services[i].CATCODE.trim())  ?   services[i].CATCODE.trim()   : '',
                (typeof services[i].STCODE !== 'undefined' && services[i].STCODE.trim())    ?   services[i].STCODE.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateServiceQuery, placeHolders)
            
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


// function for creating services records
const createServices = async (services) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < services.length; i++)
        {
            // form the data json
            dataJSON = services[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("SERVTYP", dataJSON);
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


// function for updating services records
const updateServices = async (services) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < services.length; i++)
        {
            // form the data json
            dataJSON = services[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   services[i].CLNT,
                "LANG"    :   services[i].LANG,
                "CATCODE" :	  services[i].CATCODE,
                "STCODE"  :	  services[i].STCODE
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("SERVTYP", dataJSON, clauseJSON);
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


// function for logically deleting services records
const logicalDeleteServices = async (services) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < services.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   services[i].DDATE,
                "DTIME"	  :   services[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   services[i].CLNT,
                "LANG"    :   services[i].LANG,
                "CATCODE" :	  services[i].CATCODE,
                "STCODE"  :	  services[i].STCODE
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("SERVTYP", dataJSON, clauseJSON);
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


// function for phyically deleting services records
const physicalDeleteServices = async (services) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < services.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   services[i].CLNT,
                "LANG"    :   services[i].LANG,
                "CATCODE" :	  services[i].CATCODE,
                "STCODE"  :	  services[i].STCODE
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("SERVTYP", clauseJSON);
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
    searchServices,
    serviceDetails,
    ServicesCRUDOps
};