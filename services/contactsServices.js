/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import {checkDuplicateClientsEmail} from '../services/clientServices';
import {checkDuplicateCustomersEmail} from '../services/customersServices';

import {
    searchMatchingContactsQuery, 
    searchAnyContactsQuery,
    searchContactsByIdQuery,
    checkDuplicateContactsQuery,
    checkDuplicateContactsEmailQuery,
    getContactDetailsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


/*******----------------- Query Section ------------------------ **********/

// Resolver function for query searchContacts(input) : [Contacts]
const searchContacts = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let exactMatch = args.exactMatch;
        let selectQuery;
    
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.DISNAME !== 'undefined' && args.DISNAME.trim())        ?   args.DISNAME.trim()       : '%%',
            (typeof args.COMPANY !== 'undefined' && args.COMPANY.trim())        ?   args.COMPANY.trim()       : '%%',
            (typeof args.PHONE !== 'undefined' && args.PHONE.trim())            ?   args.PHONE.trim()         : '%%',
            (typeof args.EMAILID !== 'undefined' && args.EMAILID.trim())        ?   args.EMAILID.trim()       : '%%'
        ];
    
        if(exactMatch)
        {
            selectQuery = searchMatchingContactsQuery;
        }
        else
        {
            selectQuery = searchAnyContactsQuery;
        }
    console.log(selectQuery)
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


// Resolver function for query contactDetails(input) : [Contact]
const contactDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getContactDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CONTACTID !== 'undefined' && args.CONTACTID.trim())    ?   args.CONTACTID.trim()     : '%%',
            (typeof args.EMAILID !== 'undefined' && args.EMAILID.trim())        ?   args.EMAILID.trim()       : '%%'
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

/******---------------------- Mutation Section --------------------- ******/

/**
 * CRUD Operations for Contacts
 **/
// Resolver function for mutation ContactsCRUDOps(input) : String
const ContactsCRUDOps = async (args, context, info) =>
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
            let contacts = await validateCREATEData(args.contacts);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateContacts(contacts);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createContacts(contacts);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let contacts = await validateUPDATEData(args.contacts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateContacts(contacts);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != contacts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateContacts(contacts);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let contacts = await validateDELETEData(args.contacts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateContacts(contacts);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != contacts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteContacts(contacts);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let contacts = await validateDELETEData(args.contacts);

            // Check availability of records
            let duplicateObj =  await checkDuplicateContacts(contacts);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != contacts.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteContacts(contacts);
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
const validateCREATEData = async (contacts) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < contacts.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", contacts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", contacts[i].LANG, "Language is required", validationObject);
            validations.checkNull("FRSTNM", contacts[i].FRSTNM, "First name is required", validationObject);
            //validations.checkNull("LSTNM", contacts[i].LSTNM, "Last name is required", validationObject);
            validations.checkNull("CONTACTTYPE", contacts[i].CONTACTTYPE, "Select Contacts Type", validationObject);
            validations.checkNull("EMAILID", contacts[i].EMAILID, "Email id is required", validationObject);
            validations.checkNull("PHONE", contacts[i].PHONE, "Phone number is required", validationObject);

            validations.checkMaxLength("FRSTNM", contacts[i].FRSTNM, 40, "Length of First name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("LSTNM", contacts[i].LSTNM, 40, "Length of Last name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("EMAILID", contacts[i].EMAILID, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("COMPANY", contacts[i].COMPANY, 100, "Length of Business or Law Office should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("PHONE", contacts[i].PHONE, 20, "Length of Phone number should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("FAXNO", contacts[i].FAXNO, 20, "Length of Fax number should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("ADDR", contacts[i].ADDR, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CITY", contacts[i].CITY, 40, "Length of City should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PINC", contacts[i].PINC, 40, "Length of Zip should be less than or equal to 40 characters", validationObject);
            
            validations.checkEmail("EMAILID", contacts[i].EMAILID, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHONE", contacts[i].PHONE, "Phone number should be a number", validationObject);
            
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
            
            for(let i = 0; i < contacts.length; i++)
            {
                // Get auto-generated number for contacts id
                nextNumber = await numberSeries.getNextSeriesNumber(contacts[i].CLNT, "NA", "CNTID");
                
                // Add auto-generated number as contacts id
                contacts[i].CONTACTID = nextNumber;
                
                contacts[i].DISNAME = contacts[i].FRSTNM + " " + contacts[i].LSTNM;

                // Add create params 
                contacts[i].CDATE = curDate;
                contacts[i].CTIME = curTime;
                contacts[i].ISDEL = "N";
                contacts[i].CUSER = loginUser.USERID.toLowerCase();
            }
        
            return contacts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (contacts) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < contacts.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", contacts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", contacts[i].LANG, "Language is required", validationObject);
            validations.checkNull("CONTACTID", contacts[i].CONTACTID, "Contact ID is required", validationObject);

            validations.checkNull("FRSTNM", contacts[i].FRSTNM, "First name is required", validationObject);
            //validations.checkNull("LSTNM", contacts[i].LSTNM, "Last name is required", validationObject);
            validations.checkNull("CONTACTTYPE", contacts[i].CONTACTTYPE, "Select Contacts Type", validationObject);
            validations.checkNull("EMAILID", contacts[i].EMAILID, "Email id is required", validationObject);
            validations.checkNull("PHONE", contacts[i].PHONE, "Phone number is required", validationObject);

            validations.checkMaxLength("FRSTNM", contacts[i].FRSTNM, 40, "Length of First name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("LSTNM", contacts[i].LSTNM, 40, "Length of Last name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("EMAILID", contacts[i].EMAILID, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("COMPANY", contacts[i].COMPANY, 100, "Length of Business or Law Office should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("PHONE", contacts[i].PHONE, 20, "Length of Phone number should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("FAXNO", contacts[i].FAXNO, 20, "Length of Fax number should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("ADDR", contacts[i].ADDR, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CITY", contacts[i].CITY, 40, "Length of City should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PINC", contacts[i].PINC, 40, "Length of Zip should be less than or equal to 40 characters", validationObject);

            validations.checkEmail("EMAILID", contacts[i].EMAILID, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHONE", contacts[i].PHONE, "Phone number should be a number", validationObject);

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
            
            for(let i=0; i<contacts.length; i++)
            {                

                contacts[i].DISNAME = contacts[i].FRSTNM + " " + contacts[i].LSTNM;

                // Add update params 
                contacts[i].UDATE = curDate;
                contacts[i].UTIME = curTime;
                contacts[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return contacts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (contacts) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < contacts.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", contacts[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", contacts[i].LANG, "Language is required", validationObject);
            validations.checkNull("CONTACTID", contacts[i].CONTACTID, "Contact ID is required", validationObject);

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
            
            for(let i=0; i<contacts.length; i++)
            {                
                // Add delete params 
                contacts[i].DDATE = curDate;
                contacts[i].DTIME = curTime;
                contacts[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return contacts;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateContacts = async (contacts) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < contacts.length; i++)
        {
            placeHolders = [
                (typeof contacts[i].CLNT !== 'undefined' && contacts[i].CLNT.trim())        ?   contacts[i].CLNT.trim()    : '',
                (typeof contacts[i].LANG !== 'undefined' && contacts[i].LANG.trim())        ?   contacts[i].LANG.trim()    : '',
                (typeof contacts[i].CONTACTID !== 'undefined' && contacts[i].CONTACTID.trim())          ?   contacts[i].CONTACTID.trim()     : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateContactsQuery, placeHolders)
            
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




// function for creating contacts records
const createContacts = async (contacts) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let contactIDs = [];

        for(let i = 0; i < contacts.length; i++)
        {
            // form the data json
            dataJSON = contacts[i];
            contactIDs[i] = dataJSON.CONTACTID;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TCONTACTS", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

            insertStatements.push(... await manipulateCustClients(dataJSON));
        }
        
        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;        
        return contactIDs;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating contacts records
const updateContacts = async (contacts) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let contactIDs = [];

        for(let i = 0; i < contacts.length; i++)
        {
            // form the data json
            dataJSON = contacts[i];
            contactIDs[i] = dataJSON.CONTACTID;
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   contacts[i].CLNT,
                "LANG"    :   contacts[i].LANG,
                "CONTACTID"  :	  contacts[i].CONTACTID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TCONTACTS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);

            // for the data JSON
            let leadsDataJSON = {    
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "FRSTNM":dataJSON.FRSTNM,
                "LSTNM":dataJSON.LSTNM,
                //  "CONTACTTYPE":"Lead",
                "FULLNM":dataJSON.FULLNM,
                "PHONE":dataJSON.PHONE,
                "EMAILID":dataJSON.EMAILID,
                //"COMPANY":dataJSON.OFFICENM,
                "ADDRESS":dataJSON.ADDRESS||'',
                "CITY":dataJSON.CITY||'',
                "STATE":dataJSON.STATE||'',
                "ZIPCD":dataJSON.ZIPCD||'',
                "BESTTMCAL":dataJSON.BESTTMCAL,
                "MODOFCON":dataJSON.MODOFCON,
                //"CONTACTID":dataJSON.CID,
                "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                "UTIME" : sysDateTime.systime_hh24mmss(),
                "ISDEL" : "N"
            };

            // for the clause JSON
            let leadsClauseSON = {   
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "EMAILID":dataJSON.EMAILID
            };
            
            // Get the update statement
            let updateleadsStatement = await dbServices.getUpdateStatement("EXLEADS", leadsDataJSON, leadsClauseSON);
            updateStatements.push(updateleadsStatement);








            //console.log("updateStatement => ");  console.log(updateStatement);

            updateStatements.push(... await manipulateCustClients(dataJSON));
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;    
        return contactIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for logically deleting contacts records
const logicalDeleteContacts = async (contacts) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let contactIDs = [];

        for(let i = 0; i < contacts.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   contacts[i].DDATE,
                "DTIME"	  :   contacts[i].DTIME,
                "DUSER"   :   loginUser.USERID.toLowerCase() 
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   contacts[i].CLNT,
                "LANG"    :   contacts[i].LANG,
                "CONTACTID"  :	  contacts[i].CONTACTID
            }

            contactIDs[i] = contacts[i].CONTACTID;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TCONTACTS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;     
        return contactIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting contacts records
const physicalDeleteContacts = async (contacts) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let contactIDs = [];

        for(let i = 0; i < contacts.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   contacts[i].CLNT,
                "LANG"    :   contacts[i].LANG,
                "CONTACTID"  :	  contacts[i].CONTACTID
            }
            console.log(contacts[i].EMAILID)

            contactIDs[i] = contacts[i].CONTACTID;
            
            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TCONTACTS", clauseJSON);
            deleteStatements.push(deleteStatement);
            //console.log("deleteStatement => ");  console.log(deleteStatement);
            let placeHolders = [
                (typeof contacts[i].CLNT !== 'undefined' && contacts[i].CLNT.trim())              ?   contacts[i].CLNT.trim()          : '',
                (typeof contacts[i].LANG !== 'undefined' && contacts[i].LANG.trim())              ?   contacts[i].LANG.trim()          : '',
                (typeof contacts[i].CONTACTID !== 'undefined' && contacts[i].CONTACTID.trim())    ?   contacts[i].CONTACTID.trim()     : '%%'
            ];
            let selectQuery=searchContactsByIdQuery
            let result = await dbServices.getTableData(selectQuery, placeHolders);
            console.log('result 123')
            console.log(JSON.stringify(result))

            let clauseJSONLead = {
                "CLNT"    :   contacts[i].CLNT,
                "LANG"    :   contacts[i].LANG,
                "EMAILID"  :   result[0].EMAILID
            }

            let deleteStatementlead = await dbServices.getDeleteStatement("EXLEADS", clauseJSONLead);
            deleteStatements.push(deleteStatementlead);
            console.log(deleteStatementlead)

            
        }
        
        
    
        // Use database service to get table data
        


        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        //return affectedRecords;  
        return contactIDs;
              
    } 
    catch (error) 
    {
        return error;    
    }
}



const checkDuplicateContactsEmail = async (client, lang, emailID) =>
{
    try 
    {
        
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
        let i=0;

        placeHolders = [
            (typeof client !== 'undefined' && client.trim())        ?   client.trim()       : '',
            (typeof lang !== 'undefined' && lang.trim())            ?   lang.trim()         : '',
            (typeof emailID !== 'undefined' && emailID.trim())      ?   emailID.trim()      : ''
        ];
    
        result = await dbServices.getTableData(checkDuplicateContactsEmailQuery, placeHolders)
            
        if(parseInt(result[0].COUNT) > 0)
        {
            duplicateRecordsMessage = duplicateRecordsMessage + "Record " + (i+1) + ": Duplicate record found. "; 
            duplicateCount = duplicateCount + 1;       
        }
        else
        {
            recordsNotFoundMessage = recordsNotFoundMessage + "Record " + (i+1) + ": Record not found. ";
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


// function for updating/creating Customers/Contacts/Clients
const manipulateCustClients = async (dataJSON) =>
{
    // Array for holding DML Statements
    let dmlStatements = [];

    /****------ Block for Customers -----***/
        // Check if customer already exists of not (using email id)
        let duplicateCustObj =  await checkDuplicateCustomersEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.EMAILID);

        // if all goes well, then create/update records
        if(duplicateCustObj.isDuplicate)        // Update Customers
        {
            // for the data JSON
            let customerDataJSON = {	
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "FIRSTNM":dataJSON.FRSTNM,
                "LASTNM":dataJSON.LSTNM,
                "CNAME":(dataJSON.FRSTNM + ' ' +dataJSON.LSTNM),
                "CELLNO":dataJSON.PHONE,
                "PHNO":dataJSON.PHONE,
                "CMAIL":dataJSON.EMAILID,
                "OFFICENM":dataJSON.COMPANY,
                "ADDR":dataJSON.ADDR||'',
                "CITY":dataJSON.CITY||'',
                "STATE":dataJSON.STATE||'',
                "PINC":dataJSON.PINC||'',
                "BESTTMCAL":dataJSON.BESTTMCAL,
                "MODOFCON":dataJSON.MODOFCON,
                "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                "UTIME" : sysDateTime.systime_hh24mmss(),
                "UUSER" : loginUser.USERID.toLowerCase(),
                "ISDEL" : "N"
            };

            // for the clause JSON
            let customerClauseSON = {	 
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "CMAIL":dataJSON.EMAILID
            };
            
            // Get the update statement
            let updateCustomerStatement = await dbServices.getUpdateStatement("MCUST", customerDataJSON, customerClauseSON);
            dmlStatements.push(updateCustomerStatement);

        }
        else        // Create Customers
        {
            // Get auto-generated number for contacts id
            //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CLDTID");

            // for the data JSON
            let customerDataJSON = {	 
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "FIRSTNM":dataJSON.FRSTNM,
                "LASTNM":dataJSON.LSTNM,
                "CNAME":(dataJSON.FRSTNM + ' ' +dataJSON.LSTNM),
                "CELLNO":dataJSON.PHONE,
                "PHNO":dataJSON.PHONE,
                "CMAIL":dataJSON.EMAILID,
                "OFFICENM":dataJSON.COMPANY,
                "ADDR":dataJSON.ADDR||'',
                "CITY":dataJSON.CITY||'',
                "STATE":dataJSON.STATE||'',
                "PINC":dataJSON.PINC||'',
                "BESTTMCAL":dataJSON.BESTTMCAL,
                "MODOFCON":dataJSON.MODOFCON,
                //"CCODE":nextNumber,
                "CCODE":dataJSON.CONTACTID,
                "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                "CTIME" : sysDateTime.systime_hh24mmss(),
                "CUSER" : loginUser.USERID.toLowerCase(),
                "ISDEL" : "N"
            };

            // Get the insert statement
            let insertCustomerStatement = await dbServices.getInsertStatement("MCUST", customerDataJSON);
            dmlStatements.push(insertCustomerStatement);

        }

    /****------ Block for Customers Ends-----***/

    /****------ Block for Clients -----***/

        // Check if CLIENT already exists of not (using email id)
        let duplicateClientObj =  await checkDuplicateClientsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.EMAILID);

        // if all goes well, then create/update records
        if(duplicateClientObj.isDuplicate)        // Update Clients
        {
            // for the data JSON
            let clientDataJSON = {	 
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "FIRSTNM":dataJSON.FRSTNM,
                "LASTNM":dataJSON.LSTNM,
                "PHONE":dataJSON.PHONE,
                "EMAILID":dataJSON.EMAILID,
                "OFFICENM":dataJSON.COMPANY,
                "ADDRESS":dataJSON.ADDR||'',
                "CITY":dataJSON.CITY||'',
                "STATE":dataJSON.STATE||'',
                "ZIPCD":dataJSON.PINC||'',
                "BESTTMCAL":dataJSON.BESTTMCAL,
                "MODOFCON":dataJSON.MODOFCON,
                "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                "UTIME" : sysDateTime.systime_hh24mmss(),
                "UUSER" : loginUser.USERID.toLowerCase(),
                "ISDEL" : "N"
            };

            // for the clause JSON
            let clientClauseSON = {	 
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "EMAILID":dataJSON.EMAILID
            };
            
            // Get the update statement
            let updateClientStatement = await dbServices.getUpdateStatement("CLIENTDETAILS", clientDataJSON, clientClauseSON);
            dmlStatements.push(updateClientStatement);

        }
        else        // Create Client
        {
            // Get auto-generated number for client id
            //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CLDTID");

            // for the data JSON
            let clientDataJSON = {	 
                "CLNT":dataJSON.CLNT,
                "LANG":dataJSON.LANG,
                "FIRSTNM":dataJSON.FRSTNM,
                "LASTNM":dataJSON.LSTNM,
                "PHONE":dataJSON.PHONE,
                "EMAILID":dataJSON.EMAILID,
                "OFFICENM":dataJSON.COMPANY,
                "ADDRESS":dataJSON.ADDR||'',
                "CITY":dataJSON.CITY||'',
                "STATE":dataJSON.STATE||'',
                "ZIPCD":dataJSON.PINC||'',
                "BESTTMCAL":dataJSON.BESTTMCAL,
                "MODOFCON":dataJSON.MODOFCON,
                //"CLNTID":nextNumber,
                "CLNTID":dataJSON.CONTACTID,
                "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                "CTIME" : sysDateTime.systime_hh24mmss(),
                "CUSER" : loginUser.USERID.toLowerCase(),
                "ISDEL" : "N"
            };

            // Get the insert statement
            let insertClientStatement = await dbServices.getInsertStatement("CLIENTDETAILS", clientDataJSON);
            dmlStatements.push(insertClientStatement);

        }

    /****------ Block for Clients Ends-----***/
    
    return dmlStatements;

}



// Export functions
module.exports = {
    searchContacts,
    contactDetails,
    ContactsCRUDOps,
    checkDuplicateContactsEmail
};

