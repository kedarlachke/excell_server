/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
//import {checkDuplicateContactsEmail} from '../services/contactsServices';
import {checkDuplicateCustomersEmail} from '../services/customersServices';
import ratecard from '../services/ratecardServices';

import {
    checkDuplicateClientsQuery,
    getClientDetailsQuery,
    checkDuplicateClientsEmailQuery,
    checkDuplicateContactsEmailQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query clientDetails(input) : [Client]
const clientDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getClientDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.CLNTID !== 'undefined' && args.CLNTID.trim())          ?   args.CLNTID.trim()        : '%%',
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



// Resolver function for mutation ClientCRUDOps(input) : String
const ClientCRUDOps = async (args, context, info) =>
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
            let clients = await validateCREATEData(args.clients);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateClients(clients);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createClients(clients);
                await  ratecard.RateCardForClient(affectedRecords);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let clients = await validateUPDATEData(args.clients);

            // Check availability of records
            let duplicateObj =  await checkDuplicateClients(clients);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != clients.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateClients(clients);
                await  ratecard.RateCardForClient(affectedRecords);

            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let clients = await validateDELETEData(args.clients);

            // Check availability of records
            let duplicateObj =  await checkDuplicateClients(clients);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != clients.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteClients(clients);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let clients = await validateDELETEData(args.clients);

            // Check availability of records
            let duplicateObj =  await checkDuplicateClients(clients);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != clients.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteClients(clients);
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
const validateCREATEData = async (clients) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < clients.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", clients[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", clients[i].LANG, "Language is required", validationObject);
            validations.checkNull("FIRSTNM", clients[i].FIRSTNM, "First name is required", validationObject);
            validations.checkNull("LASTNM", clients[i].LASTNM, "Last name is required", validationObject);
            validations.checkNull("EMAILID", clients[i].EMAILID, "Email id is required", validationObject);
            validations.checkNull("PHONE", clients[i].PHONE, "Phone number is required", validationObject);

            validations.checkMaxLength("FIRSTNM", clients[i].FIRSTNM, 150, "Length of First name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LASTNM", clients[i].LASTNM, 150, "Length of Last name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ADDRESS", clients[i].ADDRESS, 300, "Length of Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("CITY", clients[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMAILID", clients[i].EMAILID, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("OFFICENM", clients[i].OFFICENM, 150, "Length of Business or Law Office should be less than or equal to 150 characters", validationObject);

            validations.checkEmail("EMAILID", clients[i].EMAILID, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHONE", clients[i].PHONE, "Phone number should be a number", validationObject);
            validations.checkNumber("ZIPCD", clients[i].ZIPCD, "Zip code should be a number", validationObject);
            validations.checkNumber("FAX", clients[i].FAX, "Fax number should be a number", validationObject);


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
            
            for(let i = 0; i < clients.length; i++)
            {
                // Get auto-generated number for client id
                nextNumber = await numberSeries.getNextSeriesNumber(clients[i].CLNT, "NA", "CLDTID");
                
                // Add auto-generated number as client id
                clients[i].CLNTID = nextNumber;
        
                // Add create params 
                clients[i].CDATE = curDate;
                clients[i].CTIME = curTime;
                clients[i].ISDEL = "N";
                clients[i].CUSER = loginUser.USERID.toLowerCase();
            }
        
            return clients;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for updation
const validateUPDATEData = async (clients) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < clients.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", clients[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", clients[i].LANG, "Language is required", validationObject);
            validations.checkNull("CLNTID", clients[i].CLNTID, "Client ID is required", validationObject);
            validations.checkNull("FIRSTNM", clients[i].FIRSTNM, "First name is required", validationObject);
            validations.checkNull("LASTNM", clients[i].LASTNM, "Last name is required", validationObject);
            validations.checkNull("EMAILID", clients[i].EMAILID, "Email id is required", validationObject);
            validations.checkNull("PHONE", clients[i].PHONE, "Phone number is required", validationObject);

            validations.checkMaxLength("FIRSTNM", clients[i].FIRSTNM, 150, "Length of First name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LASTNM", clients[i].LASTNM, 150, "Length of Last name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ADDRESS", clients[i].ADDRESS, 300, "Length of Address should be less than or equal to 300 characters", validationObject);
            validations.checkMaxLength("CITY", clients[i].CITY, 50, "Length of City should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("EMAILID", clients[i].EMAILID, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("OFFICENM", clients[i].OFFICENM, 150, "Length of Business or Law Office should be less than or equal to 150 characters", validationObject);

            validations.checkEmail("EMAILID", clients[i].EMAILID, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHONE", clients[i].PHONE, "Phone number should be a number", validationObject);
            validations.checkNumber("ZIPCD", clients[i].ZIPCD, "Zip code should be a number", validationObject);
            validations.checkNumber("FAX", clients[i].FAX, "Fax number should be a number", validationObject);


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
            
            for(let i=0; i<clients.length; i++)
            {                
                // Add update params 
                clients[i].UDATE = curDate;
                clients[i].UTIME = curTime;
                clients[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return clients;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Validation funtion for deletion
const validateDELETEData = async (clients) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < clients.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", clients[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", clients[i].LANG, "Language is required", validationObject);
            validations.checkNull("CLNTID", clients[i].CLNTID, "Client ID is required", validationObject);

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
            
            for(let i=0; i<clients.length; i++)
            {                
                // Add delete params 
                clients[i].DDATE = curDate;
                clients[i].DTIME = curTime;
                clients[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return clients;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Function to check uniqueness of data
const checkDuplicateClients = async (clients) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < clients.length; i++)
        {
            placeHolders = [
                (typeof clients[i].CLNT !== 'undefined' && clients[i].CLNT.trim())        ?   clients[i].CLNT.trim()    : '',
                (typeof clients[i].LANG !== 'undefined' && clients[i].LANG.trim())        ?   clients[i].LANG.trim()    : '',
                (typeof clients[i].CLNTID !== 'undefined' && clients[i].CLNTID.trim())    ?   clients[i].CLNTID.trim()  : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateClientsQuery, placeHolders)
            
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


// function for creating client records
const createClients = async (clients) =>
{
    try 
    {                        
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let clientIDs = [];

        for(let i = 0; i < clients.length; i++)
        {
            // form the data json
            dataJSON = clients[i];
            clientIDs[i] = dataJSON.CLNTID;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("CLIENTDETAILS", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

            /****------ Block for Contacts -----***/

                // Check if contact already exists of not (using email id)
                let duplicateObj =  await checkDuplicateContactsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.EMAILID);

                // if all goes well, then create records
                if(duplicateObj.isDuplicate)        // Update Contacts
                {
                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FIRSTNM,
                        "LSTNM":dataJSON.LASTNM,
                        "CONTACTTYPE":"Client",
                        "DISNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":dataJSON.CLNTID,
                        "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "UTIME" : sysDateTime.systime_hh24mmss(),
                        "UUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // for the clause JSON
                    let contactsClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.EMAILID
                    };
                    
                    // Get the update statement
                    let updateContactsStatement = await dbServices.getUpdateStatement("TCONTACTS", contactsDataJSON, contactsClauseSON);
                    insertStatements.push(updateContactsStatement);

                }
                else        // Create contacts
                {
                    // Get auto-generated number for contacts id
                    //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CNTID");

                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FIRSTNM,
                        "LSTNM":dataJSON.LASTNM,
                        "CONTACTTYPE":"Client",
                        "DISNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":nextNumber,
                        "CONTACTID":dataJSON.CLNTID,
                        "CDATE" : dataJSON.CDATE,
                        "CTIME" : dataJSON.CTIME,
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertContactsStatement = await dbServices.getInsertStatement("TCONTACTS", contactsDataJSON);
                    insertStatements.push(insertContactsStatement);

                }
            
            /****------ Block for Contacts Ends-----***/

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
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "CNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "CELLNO":dataJSON.PHONE,
                        "PHNO":dataJSON.PHONE,
                        "CMAIL":dataJSON.EMAILID,
                        "OFFICENM":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
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
                    insertStatements.push(updateCustomerStatement);

                }
                else        // Create Customers
                {
                    // Get auto-generated number for contacts id
                    //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CLDTID");

                    // for the data JSON
                    let customerDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "CNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "CELLNO":dataJSON.PHONE,
                        "PHNO":dataJSON.PHONE,
                        "CMAIL":dataJSON.EMAILID,
                        "OFFICENM":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CCODE":nextNumber,
                        "CCODE":dataJSON.CLNTID,
                        "CDATE" : dataJSON.CDATE,
                        "CTIME" : dataJSON.CTIME,
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertCustomerStatement = await dbServices.getInsertStatement("MCUST", customerDataJSON);
                    insertStatements.push(insertCustomerStatement);

                }

            /****------ Block for Customers Ends-----***/


        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;   
        return clientIDs;            

    } 
    catch (error) 
    {
        throw error;    
    }

}

/* // function for creating client records
const createClients = async (clients) =>
{
    try 
    {                        
        let insertDML = `
            INSERT INTO CLIENTDETAILS
            SET ?
        `;

        let valuesArray = clients;

        // Use database service to insert records in table 
        let recordsInserted = await dbServices.insertTableRecords(insertDML, valuesArray) ;
        //console.log("result => ");  console.log(result);

        return recordsInserted;        
    } 
    catch (error) 
    {
        throw error;    
    }

} */

// function for updating client records
const updateClients = async (clients) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let clientIDs = [];

        for(let i = 0; i < clients.length; i++)
        {
            // form the data json
            dataJSON = clients[i];
            clientIDs[i] = dataJSON.CLNTID;
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   clients[i].CLNT,
                "LANG"    :   clients[i].LANG,
                "CLNTID"  :	  clients[i].CLNTID
            };

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CLIENTDETAILS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);

            /****------ Block for Contacts -----***/

                // Check if contact already exists of not (using email id)
                let duplicateObj =  await checkDuplicateContactsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.EMAILID);

                // if all goes well, then create records
                if(duplicateObj.isDuplicate)        // Update Contacts
                {
                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FIRSTNM,
                        "LSTNM":dataJSON.LASTNM,
                        "CONTACTTYPE":"Client",
                        "DISNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":dataJSON.CLNTID,
                        "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "UTIME" : sysDateTime.systime_hh24mmss(), 
                        "UUSER" : loginUser.USERID.toLowerCase(),       
                        "ISDEL" : "N"
                    };

                    // for the clause JSON
                    let contactsClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.EMAILID
                    };
                    
                    // Get the update statement
                    let updateContactsStatement = await dbServices.getUpdateStatement("TCONTACTS", contactsDataJSON, contactsClauseSON);

                    updateStatements.push(updateContactsStatement);

                }
                else        // Create contacts
                {
                    // Get auto-generated number for contacts id
                    //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CNTID");

                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FIRSTNM,
                        "LSTNM":dataJSON.LASTNM,
                        "CONTACTTYPE":"Client",
                        "DISNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":nextNumber,
                        "CONTACTID":dataJSON.CLNTID,
                        "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "CTIME" : sysDateTime.systime_hh24mmss(),
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertContactsStatement = await dbServices.getInsertStatement("TCONTACTS", contactsDataJSON);
                    updateStatements.push(insertContactsStatement);

                }
            
            /****------ Block for Contacts Ends-----***/

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
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "CNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "CELLNO":dataJSON.PHONE,
                        "PHNO":dataJSON.PHONE,
                        "CMAIL":dataJSON.EMAILID,
                        "OFFICENM":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
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
                    updateStatements.push(updateCustomerStatement);

                }
                else        // Create Customers
                {
                    // Get auto-generated number for contacts id
                    //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CLDTID");

                    // for the data JSON
                    let customerDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "CNAME":(dataJSON.FIRSTNM + ' ' +dataJSON.LASTNM),
                        "CELLNO":dataJSON.PHONE,
                        "PHNO":dataJSON.PHONE,
                        "CMAIL":dataJSON.EMAILID,
                        "OFFICENM":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CCODE":nextNumber,
                        "CCODE":dataJSON.CLNTID,
                        "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "CTIME" : sysDateTime.systime_hh24mmss(),
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertCustomerStatement = await dbServices.getInsertStatement("MCUST", customerDataJSON);
                    updateStatements.push(insertCustomerStatement);

                }

            /****------ Block for Customers Ends-----***/

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;   
        return clientIDs;     
     
    } 
    catch (error) 
    {
        return error;    
    }
}

// function for logically deleting client records
const logicalDeleteClients = async (clients) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let clientIDs = [];

        for(let i = 0; i < clients.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   clients[i].DDATE,
                "DTIME"	  :   clients[i].DTIME,
                "DUSER"   :   loginUser.USERID.toLowerCase()
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   clients[i].CLNT,
                "LANG"    :   clients[i].LANG,
                "CLNTID"  :	  clients[i].CLNTID
            };

            clientIDs[i] = clauseJSON.CLNTID;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("CLIENTDETAILS", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;  
        return clientIDs;     
      
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting client records
const physicalDeleteClients = async (clients) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let clientIDs = [];

        for(let i = 0; i < clients.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   clients[i].CLNT,
                "LANG"    :   clients[i].LANG,
                "CLNTID"  :	  clients[i].CLNTID
            }

            clientIDs[i] = clauseJSON.CLNTID;

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("CLIENTDETAILS", clauseJSON);
            deleteStatements.push(deleteStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        //return affectedRecords;   
        return clientIDs;     
    } 
    catch (error) 
    {
        return error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateClientsEmail = async (client, lang, emailID) =>
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
    
        result = await dbServices.getTableData(checkDuplicateClientsEmailQuery, placeHolders)
            
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


// Due to some error this function is coppied from contactsServices.js
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



//Added By Kedar in Client Services

const CreateClientFromSignUp = async(clientsData)=>{
    let affectedRecords = 0;

            // Validate input data
            let clients = await validateCREATEData(clientsData);
            //console.log(clients);
            
            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateClients(clients);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                //console.log("Create Create");
                
                affectedRecords = await createClients(clients);
                //ratecard.RateCardForClient(affectedRecords);
            }

        return affectedRecords;
}


// Export functions
module.exports = {
    clientDetails,
    ClientCRUDOps,
    checkDuplicateClientsEmail,
    CreateClientFromSignUp
};