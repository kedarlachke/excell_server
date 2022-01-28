/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
//import {checkDuplicateContactsEmail} from '../services/contactsServices';
//import {checkDuplicateClientsEmail} from '../services/clientServices';

import {
    searchMatchingCustomersQuery, 
    searchAnyCustomersQuery,
    checkDuplicateCustomersQuery,
    getCustomerDetailsQuery,
    checkDuplicateCustomersEmailQuery,
    checkDuplicateContactsEmailQuery,
    checkDuplicateClientsEmailQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchCustomers(input) : [Customers]
const searchCustomers = async (args, context, info) =>
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
            (typeof args.FIRSTNM !== 'undefined' && args.FIRSTNM.trim())        ?   args.FIRSTNM.trim()       : '%%',
            (typeof args.LASTNM !== 'undefined' && args.LASTNM.trim())          ?   args.LASTNM.trim()        : '%%',
            (typeof args.CMAIL !== 'undefined' && args.CMAIL.trim())            ?   args.CMAIL.trim()         : '%%',
            (typeof args.CELLNO !== 'undefined' && args.CELLNO.trim())          ?   args.CELLNO.trim()        : '%%'
        ];
    
        if(exactMatch)
        {
            selectQuery = searchMatchingCustomersQuery;
        }
        else
        {
            selectQuery = searchAnyCustomersQuery;
        }
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}

// Resolver function for query customerDetails(input) : [Contact]
const customerDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getCustomerDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.CCODE !== 'undefined' && args.CCODE.trim())    ?   args.CCODE.trim()         : '%%',
            (typeof args.CMAIL !== 'undefined' && args.CMAIL.trim())    ?   args.CMAIL.trim()         : '%%'
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
 * CRUD Operations for Customers
 **/
// Resolver function for mutation CustomersCRUDOps(input) : String
const CustomersCRUDOps = async (args, context, info) =>
{
    try 
    {   console.log('in CustomersCRUDOps')
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
            let customers = await validateCREATEData(args.customers);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateCustomers(customers);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createCustomers(customers);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let customers = await validateUPDATEData(args.customers);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCustomers(customers);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != customers.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateCustomers(customers);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let customers = await validateDELETEData(args.customers);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCustomers(customers);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != customers.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteCustomers(customers);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let customers = await validateDELETEData(args.customers);

            // Check availability of records
            let duplicateObj =  await checkDuplicateCustomers(customers);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != customers.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteCustomers(customers);
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
const validateCREATEData = async (customers) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < customers.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", customers[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", customers[i].LANG, "Language is required", validationObject);
            validations.checkNull("FIRSTNM", customers[i].FIRSTNM, "First name is required", validationObject);
            //validations.checkNull("LASTNM", customers[i].LASTNM, "Last name is required", validationObject);
            validations.checkNull("CMAIL", customers[i].CMAIL, "Email id is required", validationObject);
            validations.checkNull("PHNO", customers[i].PHNO, "Phone number is required", validationObject);

            validations.checkMaxLength("FIRSTNM", customers[i].FIRSTNM, 150, "Length of First name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LASTNM", customers[i].LASTNM, 150, "Length of Last name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CMAIL", customers[i].CMAIL, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("OFFICENM", customers[i].OFFICENM, 150, "Length of Business or Law Office should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ADDR", customers[i].ADDR, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CITY", customers[i].CITY, 40, "Length of City should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PINC", customers[i].PINC, 40, "Length of Zip code should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PHNO", customers[i].PHNO, 20, "Length of Phone no should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("FAXNO", customers[i].FAXNO, 20, "Length of Fax no should be less than or equal to 20 characters", validationObject);

            validations.checkEmail("CMAIL", customers[i].CMAIL, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHNO", customers[i].PHNO, "Phone number should be a number", validationObject);
            validations.checkNumber("FAXNO", customers[i].FAXNO, "Fax number should be a number", validationObject);
            validations.checkNumber("PINC", customers[i].PINC, "Zip code number should be a number", validationObject);
            
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
            
            for(let i = 0; i < customers.length; i++)
            {
                // Get auto-generated number for Customers id
                nextNumber = await numberSeries.getNextSeriesNumber(customers[i].CLNT, "NA", "CLDTID");
                
                // Add auto-generated number as Customers id
                customers[i].CCODE = nextNumber;
                
                customers[i].CNAME = customers[i].FIRSTNM + ' ' + customers[i].LASTNM;
                customers[i].CELLNO = customers[i].PHNO;

                // Add create params 
                customers[i].CDATE = curDate;
                customers[i].CTIME = curTime;
                customers[i].ISDEL = "N";
                customers[i].CUSER = loginUser.USERID.toLowerCase();
            }
        
            return customers;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (customers) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < customers.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", customers[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", customers[i].LANG, "Language is required", validationObject);
            validations.checkNull("CCODE", customers[i].CCODE, "Customer ID is required", validationObject);

            validations.checkNull("FIRSTNM", customers[i].FIRSTNM, "First name is required", validationObject);
            //validations.checkNull("LASTNM", customers[i].LASTNM, "Last name is required", validationObject);
            validations.checkNull("CMAIL", customers[i].CMAIL, "Email id is required", validationObject);
            validations.checkNull("PHNO", customers[i].PHNO, "Phone number is required", validationObject);

            validations.checkMaxLength("FIRSTNM", customers[i].FIRSTNM, 150, "Length of First name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("LASTNM", customers[i].LASTNM, 150, "Length of Last name should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CMAIL", customers[i].CMAIL, 128, "Length of Email id should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("OFFICENM", customers[i].OFFICENM, 150, "Length of Business or Law Office should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ADDR", customers[i].ADDR, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CITY", customers[i].CITY, 40, "Length of City should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PINC", customers[i].PINC, 40, "Length of Zip code should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PHNO", customers[i].PHNO, 20, "Length of Phone no should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("FAXNO", customers[i].FAXNO, 20, "Length of Fax no should be less than or equal to 20 characters", validationObject);

            validations.checkEmail("CMAIL", customers[i].CMAIL, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHNO", customers[i].PHNO, "Phone number should be a number", validationObject);
            validations.checkNumber("FAXNO", customers[i].FAXNO, "Fax number should be a number", validationObject);
            validations.checkNumber("PINC", customers[i].PINC, "Zip code number should be a number", validationObject);

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
            
            for(let i=0; i<customers.length; i++)
            {                

                customers[i].CNAME = customers[i].FIRSTNM + ' ' + customers[i].LASTNM;
                customers[i].CELLNO = customers[i].PHNO;

                // Add update params 
                customers[i].UDATE = curDate;
                customers[i].UTIME = curTime;
                customers[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return customers;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (customers) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < customers.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", customers[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", customers[i].LANG, "Language is required", validationObject);
            validations.checkNull("CCODE", customers[i].CCODE, "Customer ID is required", validationObject);

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
            
            for(let i=0; i<customers.length; i++)
            {                
                // Add delete params 
                customers[i].DDATE = curDate;
                customers[i].DTIME = curTime;
                customers[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return customers;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateCustomers = async (customers) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < customers.length; i++)
        {
            placeHolders = [
                (typeof customers[i].CLNT !== 'undefined' && customers[i].CLNT.trim())        ?   customers[i].CLNT.trim()    : '',
                (typeof customers[i].LANG !== 'undefined' && customers[i].LANG.trim())        ?   customers[i].LANG.trim()    : '',
                (typeof customers[i].CCODE !== 'undefined' && customers[i].CCODE.trim())      ?   customers[i].CCODE.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateCustomersQuery, placeHolders)
            
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


// function for creating Customers records
const createCustomers = async (customers) =>
{
    try 
    {   
        console.log('cust 1')
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;
        let customerIDs = [];

        for(let i = 0; i < customers.length; i++)
        {
            // form the data json
            //console.log('cust 2')
            dataJSON = customers[i];
            customerIDs[i] = customers[i].CCODE;

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("MCUST", dataJSON);
            //console.log(insertStatement)
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

            /****------ Block for Contacts -----***/

                // Check if contact already exists of not (using email id)
                /*let duplicateObj =  await checkDuplicateContactsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.CMAIL);

                // if all goes well, then create records
                if(duplicateObj.isDuplicate)        // Update Contacts
                {
                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FIRSTNM,
                        "LSTNM":dataJSON.LASTNM,
                        "CONTACTTYPE":"Customer",
                        "DISNAME":dataJSON.CNAME,
                        "PHONE":dataJSON.PHNO,
                        "EMAILID":dataJSON.CMAIL,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDR||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.PINC||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CCODE":dataJSON.CID,
                        "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "UTIME" : sysDateTime.systime_hh24mmss(),
                        "UUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // for the clause JSON
                    let contactsClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.CMAIL
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
                        "CONTACTTYPE":"Customer",
                        "DISNAME":dataJSON.CNAME,
                        "PHONE":dataJSON.PHNO,
                        "EMAILID":dataJSON.CMAIL,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDR||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.PINC||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":nextNumber,
                        "CONTACTID":dataJSON.CCODE,
                        "CDATE" : dataJSON.CDATE,
                        "CTIME" : dataJSON.CTIME,
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertContactsStatement = await dbServices.getInsertStatement("TCONTACTS", contactsDataJSON);
                    insertStatements.push(insertContactsStatement);

                }*/
            
            /****------ Block for Contacts Ends-----***/

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
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "PHONE":dataJSON.PHNO,
                        "EMAILID":dataJSON.CMAIL,
                        "OFFICENM":dataJSON.OFFICENM||'',
                        "ADDRESS":dataJSON.ADDR||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "ZIPCD":dataJSON.PINC||'',
                        "FAX":dataJSON.FAXNO||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL||'',
                        "MODOFCON":dataJSON.MODOFCON||'',
                        "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "UTIME" : sysDateTime.systime_hh24mmss(),
                        "UUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };
                    console.log('#########################################')  
                    //console.log(clientDataJSON)  
                    console.log('#########################################')   
                    // for the clause JSON
                    let clientClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.EMAILID
                    };
                    
                    // Get the update statement
                    let updateClientStatement = await dbServices.getUpdateStatement("CLIENTDETAILS", clientDataJSON, clientClauseSON);
                    insertStatements.push(updateClientStatement);

                }
                else        // Create Client
                {
                    // Get auto-generated number for client id
                    //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CLDTID");

                    // for the data JSON
                    let clientDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "PHONE":dataJSON.PHNO,
                        "EMAILID":dataJSON.CMAIL,
                        "OFFICENM":dataJSON.OFFICENM||'',
                        "ADDRESS":dataJSON.ADDR||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "ZIPCD":dataJSON.PINC||'',
                        "FAX":dataJSON.FAXNO||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL||'',
                        "MODOFCON":dataJSON.MODOFCON||'',
                        //"CLNTID":nextNumber,
                        "CLNTID":dataJSON.CCODE,
                        "CDATE" : dataJSON.CDATE,
                        "CTIME" : dataJSON.CTIME,
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    console.log('#########################################')  
                    console.log(clientDataJSON)  
                    console.log('#########################################') 
                    let insertClientStatement = await dbServices.getInsertStatement("CLIENTDETAILS", clientDataJSON);
                    insertStatements.push(insertClientStatement);
                    console.log(insertClientStatement)

                }

            /****------ Block for Clients Ends-----***/

        }
        // for(var x=0;x<insertStatements.length;x++){
        //   console.log(insertStatements[x])}
        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        //return affectedRecords;        
        return customerIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating Customers records
const updateCustomers = async (customers) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let customerIDs = [];

        for(let i = 0; i < customers.length; i++)
        {
            // form the data json
            dataJSON = customers[i];
            customerIDs[i] = customers[i].CCODE;
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   customers[i].CLNT,
                "LANG"    :   customers[i].LANG,
                "CCODE"   :	  customers[i].CCODE
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("MCUST", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);

            /****------ Block for Contacts -----***/

                // Check if contact already exists of not (using email id)
                let duplicateObj =  await checkDuplicateContactsEmail(dataJSON.CLNT, dataJSON.LANG, dataJSON.CMAIL);

                // if all goes well, then create records
                if(duplicateObj.isDuplicate)        // Update Contacts
                {
                    // for the data JSON
                    let contactsDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FRSTNM":dataJSON.FIRSTNM,
                        "LSTNM":dataJSON.LASTNM,
                        "CONTACTTYPE":"Customer",
                        "DISNAME":dataJSON.CNAME,
                        "PHONE":dataJSON.PHNO,
                        "EMAILID":dataJSON.CMAIL,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDR||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.PINC||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":dataJSON.CCODE,
                        "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "UTIME" : sysDateTime.systime_hh24mmss(),
                        "UUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // for the clause JSON
                    let contactsClauseSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "EMAILID":dataJSON.CMAIL
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
                        "CONTACTTYPE":"Customer",
                        "DISNAME":dataJSON.CNAME,
                        "PHONE":dataJSON.PHNO,
                        "EMAILID":dataJSON.CMAIL,
                        "COMPANY":dataJSON.OFFICENM,
                        "ADDR":dataJSON.ADDR||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "PINC":dataJSON.PINC||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CONTACTID":nextNumber,
                        "CONTACTID":dataJSON.CCODE,
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
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "OFFICENM":dataJSON.OFFICENM,
                        "ADDRESS":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "ZIPCD":dataJSON.ZIPCD||'',
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
                    updateStatements.push(updateClientStatement);

                }
                else        // Create Client
                {
                    // Get auto-generated number for client id
                    //let nextNumber = await numberSeries.getNextSeriesNumber(dataJSON.CLNT, "NA", "CLDTID");

                    // for the data JSON
                    let clientDataJSON = {	 
                        "CLNT":dataJSON.CLNT,
                        "LANG":dataJSON.LANG,
                        "FIRSTNM":dataJSON.FIRSTNM,
                        "LASTNM":dataJSON.LASTNM,
                        "PHONE":dataJSON.PHONE,
                        "EMAILID":dataJSON.EMAILID,
                        "OFFICENM":dataJSON.OFFICENM,
                        "ADDRESS":dataJSON.ADDRESS||'',
                        "CITY":dataJSON.CITY||'',
                        "STATE":dataJSON.STATE||'',
                        "ZIPCD":dataJSON.ZIPCD||'',
                        "BESTTMCAL":dataJSON.BESTTMCAL,
                        "MODOFCON":dataJSON.MODOFCON,
                        //"CLNTID":nextNumber,
                        "CLNTID": dataJSON.CCODE,
                        "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                        "CTIME" : sysDateTime.systime_hh24mmss(),
                        "CUSER" : loginUser.USERID.toLowerCase(),
                        "ISDEL" : "N"
                    };

                    // Get the insert statement
                    let insertClientStatement = await dbServices.getInsertStatement("CLIENTDETAILS", clientDataJSON);
                    updateStatements.push(insertClientStatement);

                }

            /****------ Block for Clients Ends-----***/


        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;        
        return customerIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for logically deleting Customers records
const logicalDeleteCustomers = async (customers) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let customerIDs = [];

        for(let i = 0; i < customers.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   customers[i].DDATE,
                "DTIME"	  :   customers[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   customers[i].CLNT,
                "LANG"    :   customers[i].LANG,
                "CCODE"   :	  customers[i].CCODE
            }

            customerIDs[i] = customers[i].CCODE;

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("MCUST", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        //return affectedRecords;   
        return customerIDs;

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for phyically deleting Customers records
const physicalDeleteCustomers = async (customers) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;
        let customerIDs = [];

        for(let i = 0; i < customers.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   customers[i].CLNT,
                "LANG"    :   customers[i].LANG,
                "CCODE"   :	  customers[i].CCODE
            }

            customerIDs[i] = customers[i].CCODE;

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("MCUST", clauseJSON);
            deleteStatements.push(deleteStatement);
            //console.log("deleteStatement => ");  console.log(deleteStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(deleteStatements);

        //return affectedRecords;  
        return customerIDs;
      
    } 
    catch (error) 
    {
        return error;    
    }
}



// Function to check uniqueness of data
const checkDuplicateCustomersEmail = async (client, lang, emailID) =>
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
    
        result = await dbServices.getTableData(checkDuplicateCustomersEmailQuery, placeHolders)
            
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



// Due to circular dependency this function is coppied from contactsServices.js
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



// Due to circular dependency this function is coppied from clientServices.js
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


// Export functions
module.exports = {
    searchCustomers,
    customerDetails,
    CustomersCRUDOps,
    checkDuplicateCustomersEmail
};


