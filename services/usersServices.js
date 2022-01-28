/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import { createUsername , updateUsername } from './authentication'
import { generateTokenUser} from './authenticationJWT'

import clientServices from '../services/clientServices'
import emailServices from '../services/emailServices';
import emailTemplateServices from '../services/emailTemplateServices';


import {
    searchMatchingUsersQuery, 
    searchAnyUsersQuery,
    checkDuplicateUsersQuery,
    getUserDetailsQuery,
    searchAuthorizationsQuery,
    checkDuplicateUsersAuthQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI);


const MongoUser = require('../models/user');

// Resolver function for query searchUsers(input) : [Users]
const searchUsers = async (args, context, info) =>
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
            (typeof args.USRID !== 'undefined' && args.USRID.trim())            ?   args.USRID.trim()         : '%%',
            (typeof args.USRNM !== 'undefined' && args.USRNM.trim())            ?   args.USRNM.trim()         : '%%',
            (typeof args.UMAIL !== 'undefined' && args.UMAIL.trim())            ?   args.UMAIL.trim()         : '%%',
            (typeof args.CELLNO !== 'undefined' && args.CELLNO.trim())          ?   args.CELLNO.trim()        : '%%'
        ];
    
        if(exactMatch)
        {
            selectQuery = searchMatchingUsersQuery;
    
            // Add placeholders for additional values 
            let placeHolders2 = [
                (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
                (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
                (typeof args.USRID !== 'undefined' && args.USRID.trim())            ?   args.USRID.trim()         : '%%',
                (typeof args.USRNM !== 'undefined' && args.USRNM.trim())            ?   args.USRNM.trim()         : '%%',
                (typeof args.UMAIL !== 'undefined' && args.UMAIL.trim())            ?   args.UMAIL.trim()         : '%%',
                (typeof args.CELLNO !== 'undefined' && args.CELLNO.trim())          ?   args.CELLNO.trim()        : '%%'
            ];
            
            placeHolders.push(...placeHolders2);
    
        }
        else
        {
            selectQuery = searchAnyUsersQuery;
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


// Resolver function for query userDetails(input) : [Task]
const userDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getUserDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.USRID !== 'undefined' && args.USRID.trim())    ?   args.USRID.trim()         : ''
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


// Resolver function for query searchAuthorizations(input) : [Task]
const searchAuthorizations = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchAuthorizationsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.USRID !== 'undefined' && args.USRID.trim())    ?   args.USRID.trim()         : '',
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : ''
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
 * CRUD Operations for Users
 **/
// Resolver function for mutation UsersCRUDOps(input) : String
const UsersCRUDOps = async (args, context, info) =>
{
    let resultmongo='';
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
            let users = await validateCREATEData(args.users);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateUsers(users);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createUsers(users);
                resultmongo =  await createMongoUser(users);
               // createUsername({ email : users , password, applicationid, client, lang, mobile, username })
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let users = await validateUPDATEData(args.users);

            // Check availability of records
            let duplicateObj =  await checkDuplicateUsers(users);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != users.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateUsers(users);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let users = await validateDELETEData(args.users);

            // Check availability of records
            let duplicateObj =  await checkDuplicateUsers(users);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != users.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteUsers(users);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let users = await validateDELETEData(args.users);

            // Check availability of records
            let duplicateObj =  await checkDuplicateUsers(users);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != users.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteUsers(users);
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
const validateCREATEData = async (users) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < users.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", users[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", users[i].LANG, "Language is required", validationObject);
            validations.checkNull("FNAME", users[i].FNAME, "First name is required", validationObject);
            //validations.checkNull("LNAME", users[i].LNAME, "Last name is required", validationObject);
            validations.checkNull("UMAIL", users[i].UMAIL, "Email id is required", validationObject);
            validations.checkNull("CELLNO", users[i].CELLNO, "Phone number is required", validationObject);
            //validations.checkNull("USEX", users[i].USEX, "Gender is required", validationObject);
            validations.checkNull("USRID", users[i].USRID, "User ID is required", validationObject);
            validations.checkNull("PWDRD", users[i].PWDRD, "Password is required", validationObject);
            validations.checkNull("RPPWDRD", users[i].RPPWDRD, "Password is required", validationObject);

            validations.checkMaxLength("FNAME", users[i].FNAME, 40, "Length of First name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("LNAME", users[i].LNAME, 40, "Length of Last name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("USRNM", users[i].USRNM, 40, "Length of Username should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("USRID", users[i].USRID, 128, "Length of User ID should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("PWDRD", users[i].PWDRD, 40, "Length of Password should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("ADDR", users[i].ADDR, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ADDR1", users[i].ADDR1, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CITY", users[i].CITY, 40, "Length of City should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PINC", users[i].PINC, 40, "Length of Zip code should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("COFF", users[i].COFF, 150, "Length of Care off should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("SANS", users[i].SANS, 40, "Length of Answer should be less than or equal to 40 characters", validationObject);

            validations.checkMinLength("USRID", users[i].USRID, 6, "Length of User ID should be greater than or equal to 6 characters", validationObject);
            validations.checkMinLength("PWDRD", users[i].PWDRD, 6, "Length of Password should be greater than or equal to 6 characters", validationObject);

            validations.checkEmail("UMAIL", users[i].UMAIL, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHNO", users[i].PHNO, "Phone(Other) number should be a number", validationObject);
            validations.checkNumber("CELLNO", users[i].CELLNO, "Phone(Mobile) number should be a number", validationObject);
            
            if(Object.keys(validationObject).length == 0)
                if(users[i].PWDRD != users[i].RPPWDRD)
                    validationObject["errorRPPWDRD"] = "Password does not match";
    
            
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
            
            for(let i = 0; i < users.length; i++)
            {
                users[i].LLGTM = "000000";
                users[i].PTIME = "000000";
                users[i].ISFTIME = "Y";
				users[i].ISLCK = "N";
				users[i].FLRCNT = "0";

                // Add create params 
                users[i].CDATE = curDate;
                users[i].CTIME = curTime;
                users[i].ISDEL = "N";
                users[i].CUSER = loginUser.USERID.toLowerCase();

                delete users[i].RPPWDRD;
                
            }
        
            return users;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (users) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < users.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", users[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", users[i].LANG, "Language is required", validationObject);
            validations.checkNull("FNAME", users[i].FNAME, "First name is required", validationObject);
            //validations.checkNull("LASTNM", users[i].LASTNM, "Last name is required", validationObject);
            validations.checkNull("UMAIL", users[i].UMAIL, "Email id is required", validationObject);
            validations.checkNull("CELLNO", users[i].CELLNO, "Phone number is required", validationObject);
            //validations.checkNull("USEX", users[i].USEX, "Gender is required", validationObject);
            validations.checkNull("USRID", users[i].USRID, "User ID is required", validationObject);
            validations.checkNull("PWDRD", users[i].PWDRD, "Password is required", validationObject);
            validations.checkNull("RPPWDRD", users[i].RPPWDRD, "Password is required", validationObject);

            validations.checkMaxLength("FNAME", users[i].FNAME, 40, "Length of First name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("LNAME", users[i].LNAME, 40, "Length of Last name should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("USRNM", users[i].USRNM, 40, "Length of Username should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("USRID", users[i].USRID, 128, "Length of User ID should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("PWDRD", users[i].PWDRD, 40, "Length of Password should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("ADDR", users[i].ADDR, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("ADDR1", users[i].ADDR1, 150, "Length of Address should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("CITY", users[i].CITY, 40, "Length of City should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("PINC", users[i].PINC, 40, "Length of Zip code should be less than or equal to 40 characters", validationObject);
            validations.checkMaxLength("COFF", users[i].COFF, 150, "Length of Care off should be less than or equal to 150 characters", validationObject);
            validations.checkMaxLength("SANS", users[i].SANS, 40, "Length of Answer should be less than or equal to 40 characters", validationObject);

            validations.checkMinLength("USRID", users[i].USRID, 6, "Length of User ID should be greater than or equal to 6 characters", validationObject);
            validations.checkMinLength("PWDRD", users[i].PWDRD, 6, "Length of Password should be greater than or equal to 6 characters", validationObject);

            validations.checkEmail("UMAIL", users[i].UMAIL, "Email id is not valid", validationObject);
            
            validations.checkNumber("PHNO", users[i].PHNO, "Phone(Other) number should be a number", validationObject);
            validations.checkNumber("CELLNO", users[i].CELLNO, "Phone(Mobile) number should be a number", validationObject);
            
            if(Object.keys(validationObject).length == 0)
                if(users[i].PWDRD != users[i].RPPWDRD)
                    validationObject["errorRPPWDRD"] = "Password does not match";

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
            
            for(let i=0; i<users.length; i++)
            {                

                users[i].ISLCK = "N";

                // Add update params 
                users[i].UDATE = curDate;
                users[i].UTIME = curTime;
                users[i].UUSER = loginUser.USERID.toLowerCase();

                delete users[i].RPPWDRD;
            }
        
            return users;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (users) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < users.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", users[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", users[i].LANG, "Language is required", validationObject);
            validations.checkNull("USRID", users[i].USRID, "User ID is required", validationObject);

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
            
            for(let i=0; i<users.length; i++)
            {                
                // Add delete params 
                users[i].DDATE = curDate;
                users[i].DTIME = curTime;
                users[i].DUSER = loginUser.USERID.toLowerCase();

                delete users[i].RPPWDRD;
            }
        
            return users;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// Function to check uniqueness of data
const checkDuplicateUsers = async (users) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < users.length; i++)
        {
            placeHolders = [
                (typeof users[i].CLNT !== 'undefined' && users[i].CLNT.trim())        ?   users[i].CLNT.trim()    : '',
                (typeof users[i].LANG !== 'undefined' && users[i].LANG.trim())        ?   users[i].LANG.trim()    : '',
                (typeof users[i].USRID !== 'undefined' && users[i].USRID.trim())      ?   users[i].USRID.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateUsersQuery, placeHolders)
            
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


// function for creating users records
const createUsers = async (users) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < users.length; i++)
        {
            // form the data json
            dataJSON = users[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TUSER", dataJSON);
            insertStatements.push(insertStatement);

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



// function for creating users records
const createMongoUser = async (users) =>
{
    
 try 
    {   
       
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < users.length; i++)
        {
            // form the data json
            dataJSON = users[i];

            // Get the insert statement
           
     createUsername({ "email" : dataJSON.UMAIL , "password" : dataJSON.PWDRD , "applicationid" : '15001500' , "client" : '1002', "lang" : dataJSON.LANG , "mobile" : dataJSON.CELLNO, "username" : dataJSON.USRID })

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



// function for updating users records
const updateUsers = async (users) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < users.length; i++)
        {
            // form the data json
            dataJSON = users[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   users[i].CLNT,
                "LANG"    :   users[i].LANG,
                "USRID"   :	  users[i].USRID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TUSER", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        updateUsername({ "email" : dataJSON.UMAIL , "password" : dataJSON.PWDRD , "applicationid" : '15001500' , "client" : '1002', "lang" : dataJSON.LANG , "mobile" : dataJSON.CELLNO, "username" : dataJSON.USRID })

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for logically deleting users records
const logicalDeleteUsers = async (users) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < users.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   users[i].DDATE,
                "DTIME"	  :   users[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   users[i].CLNT,
                "LANG"    :   users[i].LANG,
                "USRID"   :	  users[i].USRID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TUSER", dataJSON, clauseJSON);
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


// function for phyically deleting users records
const physicalDeleteUsers = async (users) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < users.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   users[i].CLNT,
                "LANG"    :   users[i].LANG,
                "USRID"   :	  users[i].USRID
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TUSER", clauseJSON);
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



// function for updating invoices status and payment mode
const updateUserAuthorizations = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);
        
        let insertStatement, deleteStatement;             
        let dmlStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        let user = {
            "CLNT"    : args.CLNT,
            "LANG"    : args.LANG,
            "USRID"   : args.USRID
        };

        // Check availability of records
        let duplicateObj =  await checkDuplicateUsers([user]);

        // if all goes well, then update records
        if(!duplicateObj.isDuplicate)
        {
            throw new Error(duplicateObj.recordsNotFoundMessage);
        }
        else
        {   
            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TGPUSR", user);
            dmlStatements.push(deleteStatement);

            let groupIds = args.GRPID;

            for(let i = 0; i < groupIds.length; i++)
            {
                // form the data json
                dataJSON = {
                    "CLNT"    : args.CLNT,
                    "LANG"    : args.LANG,
                    "USRID"   : args.USRID,        
                    "GRPID" : groupIds[i],
                    "ISDEL" : "N",
                    "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                    "CTIME" : sysDateTime.systime_hh24mmss(),
                    "CUSER" : loginUser.USERID.toLowerCase()
                };
                
                // Get the insert statement
                insertStatement = await dbServices.getInsertStatement("TGPUSR", dataJSON);
                dmlStatements.push(insertStatement);

            }         

            // Use db service to execute DML transactions
            affectedRecords = await dbServices.executeDMLTransactions(dmlStatements);

            return affectedRecords;  
        }
          
    } 
    catch (error) 
    {
        return error;    
    }
}


//Code Added By Kedar  in User Service
const updateSignUpCustomerAuthorizations =async(UserData)=>{
    try 
    {   
        let insertStatement, deleteStatement;             
        let dmlStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        let user = {
            "CLNT"    : UserData.CLNT,
            "LANG"    : UserData.LANG,
            "USRID"   : UserData.USRID
        };

        // Check availability of records
        let duplicateObj =  await checkDuplicateUsers([user]);

        // if all goes well, then update records
        if(!duplicateObj.isDuplicate)
        {
            throw new Error(duplicateObj.recordsNotFoundMessage);
        }
        else
        {   
            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TGPUSR", user);
            dmlStatements.push(deleteStatement);

            let groupIds = UserData.GRPID;

            for(let i = 0; i < groupIds.length; i++)
            {
                // form the data json
                dataJSON = {
                    "CLNT"    : UserData.CLNT,
                    "LANG"    : UserData.LANG,
                    "USRID"   : UserData.USRID,        
                    "GRPID" : groupIds[i],
                    "ISDEL" : "N",
                    "CDATE" : sysDateTime.sysdate_yyyymmdd(),
                    "CTIME" : sysDateTime.systime_hh24mmss(),
                    "CUSER" : loginUser.USERID.toLowerCase()
                };
                
                // Get the insert statement
                insertStatement = await dbServices.getInsertStatement("TGPUSR", dataJSON);
                dmlStatements.push(insertStatement);

            }         

            // Use db service to execute DML transactions
            affectedRecords = await dbServices.executeDMLTransactions(dmlStatements);

            return affectedRecords;  
        }
          
    } 
    catch (error) 
    {
        return error;    
    }

}


const SignUpCustomerUsername=async (args, context, info) =>
{

    console.log('x1');
    let a,b,c,d ;
    let Users=args.users;
        try{            
            console.log('x2');

   //         a= await UsersCRUDOps(args, context, info);

//new 

loginUser = validations.getLoginData(context);
console.log('x2.1');
// Get the transaction from arguments
let transaction = args.transaction;

let affectedRecords = 0;
console.log('x2.2');
// If transaction is not available
if(typeof transaction === 'undefined' || transaction.trim().length == 0)
    throw new Error("Transaction is required and can not be empty.");

transaction = transaction.trim().toUpperCase();    

if(transaction == "CREATE")     // Create 
{

    // Validate input data
    let users = await validateCREATEData(args.users);
    console.log('x2.3');
    // Check uniqueness of input data
    let duplicateObj =  await checkDuplicateUsers(users);
    console.log('x2.4');
    // if all goes well, then create records
    if(duplicateObj.isDuplicate)
    {
        console.log('x2.5');
        throw new Error(duplicateObj.duplicateRecordsMessage);
    }
    else
    {
        console.log('x2.6');
        affectedRecords = await createUsers(users);
       a=affectedRecords;
       // createUsername({ email : users , password, applicationid, client, lang, mobile, username })
    }

}   

//new end




    
    
    if(a==1){
     
    for(let i = 0; i < Users.length; i++)
    {
        console.log('x3');

        let User=Users[i];
    let userData={
        "CLNT"    : User.CLNT,
        "LANG"    : User.LANG,
        "USRID"   : User.USRID,
        "GRPID"   : "ECUS"
    };
     b =await updateSignUpCustomerAuthorizations(userData);
    //console.log("User Authorisation ->" +b);
    let clientData=[{
        "CLNT"	  : User.CLNT,
        "PASSWORD": User.PWDRD,
        "LANG"	  : User.LANG,
        "FIRSTNM" : User.FNAME,
        "LASTNM"  : User.LNAME,
        "OFFICENM": User.OFFICENM,
        "EMAILID" : User.USRID,
        "PHONE"	  : User.PHNO,
        "BESTTMCAL":"",
        "MODOFCON":""
    }];
     c= await clientServices.CreateClientFromSignUp(clientData);
     let userAuth=[{
        "CLNT":Users[0].CLNT,
        "LANG":Users[0].LANG,
        "AUTHTYP":"CUS",
        "AUTHCD":"CASES",
        "USRID":Users[0].UMAIL
    },{
        "CLNT":Users[0].CLNT,
        "LANG":Users[0].LANG,
        "AUTHTYP":"CUS",
        "AUTHCD":"INVOICE",
        "USRID":Users[0].UMAIL
    }];
    let d =await CreateUserAuthorizationFromSignUp(userAuth);

    console.log('x4');


    let e = await sendCustomerCreationMail(Users);


// added by rhishi

// console.log('start user');
// console.log(User);
// console.log('end user');

let applicationid = '15001500';
let client = User.CLNT ;
let lang= User.LANG ;
let username= User.USRID ;
let password = User.PWDRD ;
let email = User.USRID ;

console.log('x6');




if (!username || !password) { throw new Error('You must provide an username and password.'); }
return MongoUser.findOne({ applicationid, client, lang, username })
  .then(
    existingUser => {
      if (existingUser) {     
        console.log('x7');

    //   console.log('start existingUser');
    //   console.log(existingUser);
    //   console.log('end existingUser');    
      throw new Error('Username in use'); }
      const user = new MongoUser({ applicationid, client, lang, username, password, email }); //Initialise new user
      return user.save();
    }
  )
  .then(
    user => {
        console.log('x8');

      return new Promise((resolve, reject) => {
        console.log('***received COOKIE req added user***');
        console.log(user);
        context.request.login(user, (err) => {
          if (err) { reject(err); }
          resolve(user);
        });
      });
    });









// added by rhishi end





    } 

}
//return a




    }catch (error) 
    {
        console.log(error);
        return error;  
        
          
    }
}




const SignUpCustomerUsernameJWT=async (args, context, info) =>
{

    console.log('x1');
    let a,b,c,d ;
    let Users=args.users;
        try{            
            console.log('x2');

   //         a= await UsersCRUDOps(args, context, info);

//new 

loginUser = validations.getLoginData(context);
console.log('x2.1');
// Get the transaction from arguments
let transaction = args.transaction;

let affectedRecords = 0;
console.log('x2.2');
// If transaction is not available
if(typeof transaction === 'undefined' || transaction.trim().length == 0)
    throw new Error("Transaction is required and can not be empty.");

transaction = transaction.trim().toUpperCase();    

if(transaction == "CREATE")     // Create 
{

    // Validate input data
    let users = await validateCREATEData(args.users);
    console.log('x2.3');
    // Check uniqueness of input data
    let duplicateObj =  await checkDuplicateUsers(users);
    console.log('x2.4');
    // if all goes well, then create records
    if(duplicateObj.isDuplicate)
    {
        console.log('x2.5');
        throw new Error(duplicateObj.duplicateRecordsMessage);
    }
    else
    {
        console.log('x2.6');
        affectedRecords = await createUsers(users);
       a=affectedRecords;
       // createUsername({ email : users , password, applicationid, client, lang, mobile, username })
    }

}   

//new end




    
    
    if(a==1){
     
    for(let i = 0; i < Users.length; i++)
    {
        console.log('x3');

        let User=Users[i];
    let userData={
        "CLNT"    : User.CLNT,
        "LANG"    : User.LANG,
        "USRID"   : User.USRID,
        "GRPID"   : "ECUS"
    };
     b =await updateSignUpCustomerAuthorizations(userData);
    //console.log("User Authorisation ->" +b);
    let clientData=[{
        "CLNT"	  : User.CLNT,
        "PASSWORD": User.PWDRD,
        "LANG"	  : User.LANG,
        "FIRSTNM" : User.FNAME,
        "LASTNM"  : User.LNAME,
        "OFFICENM": User.OFFICENM,
        "EMAILID" : User.USRID,
        "PHONE"	  : User.PHNO,
        "BESTTMCAL":"",
        "MODOFCON":""
    }];
     c= await clientServices.CreateClientFromSignUp(clientData);
     let userAuth=[{
        "CLNT":Users[0].CLNT,
        "LANG":Users[0].LANG,
        "AUTHTYP":"CUS",
        "AUTHCD":"CASES",
        "USRID":Users[0].UMAIL
    },{
        "CLNT":Users[0].CLNT,
        "LANG":Users[0].LANG,
        "AUTHTYP":"CUS",
        "AUTHCD":"INVOICE",
        "USRID":Users[0].UMAIL
    }];
    let d =await CreateUserAuthorizationFromSignUp(userAuth);

    console.log('x4');





// added by rhishi

// console.log('start user');
// console.log(User);
// console.log('end user');

let applicationid = '15001500';
let client = User.CLNT ;
let lang= User.LANG ;
let username= User.USRID ;
let password = User.PWDRD ;
let email = User.USRID ;

console.log('x6');




const user = new MongoUser({ applicationid, client, lang, username, password, email }); //Initialise new user


if (!username || !password) { throw new Error('You must provide an username and password.'); }
return MongoUser.findOne({ applicationid, client, lang, username })
  .then(
    existingUser => {
      if (existingUser) { throw new Error('Username in use'); }
      return user.save();
    }
  )
  .then(
    user => {
      return new Promise((resolve, reject) => {
        context.request.login(user, (err) => {
          if (err) { reject(err); }

          const token = generateTokenUser(user);

          user.token = token;




          resolve(user);
        });
      });
    });

// added by rhishi end

    } 

}

    }catch (error) 
    {
        console.log(error);
        return error;  
        
          
    }
}




const validateCREATEAuthData =async(users)=>{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < users.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", users[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", users[i].LANG, "Language is required", validationObject);
            validations.checkNull("AUTHTYP", users[i].AUTHTYP, "AUTHTYP name is required", validationObject);
            validations.checkNull("USRID", users[i].USRID, "User Id is required", validationObject);
            validations.checkNull("AUTHCD", users[i].AUTHCD, "AUTHCD id is required", validationObject);
            validations.checkNull("USRNM", users[i].USRNM, "User Name is required", validationObject);
                        
            if(Object.keys(validationObject).length == 0)
                
    
            
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
            
            for(let i = 0; i < users.length; i++)
            {
                // Add create params 
                users[i].CDATE = curDate;
                users[i].CTIME = curTime;
                users[i].ISDEL = "N";
                users[i].CUSER = loginUser.USERID.toLowerCase();

                
                
            }
        
            return users;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}

// function for creating usersAuth records
const createUsersAuth = async (users) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < users.length; i++)
        {
            // form the data json
            dataJSON = users[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TUSRAUTH", dataJSON);
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

const checkDuplicateAuthUsers = async (users) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < users.length; i++)
        {
            placeHolders = [
                (typeof users[i].CLNT !== 'undefined' && users[i].CLNT.trim())        ?   users[i].CLNT.trim()    : '',
                (typeof users[i].LANG !== 'undefined' && users[i].LANG.trim())        ?   users[i].LANG.trim()    : '',
                (typeof users[i].USRID !== 'undefined' && users[i].USRID.trim())      ?   users[i].USRID.trim()   : '',
                (typeof users[i].AUTHCD !== 'undefined' && users[i].AUTHCD.trim())      ?   users[i].AUTHCD.trim()   : '',
                (typeof users[i].AUTHTYP !== 'undefined' && users[i].AUTHTYP.trim())      ?   users[i].AUTHTYP.trim()   : '',
            ];
    
            //console.log(placeHolders);
            //console.log(checkDuplicateUsersAuthQuery);
            
            
            result = await dbServices.getTableData(checkDuplicateUsersAuthQuery, placeHolders)
            //console.log(result);
            
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



const CreateUserAuthorizationFromSignUp = async(UserData)=>{
    let affectedRecords = 0;

            // Validate input data
            let User = await validateCREATEAuthData(UserData);
            //console.log(clients);
            
            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateAuthUsers(User);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                //console.log("Create Create");
                
                affectedRecords = await createUsersAuth(User);
                //ratecard.RateCardForClient(affectedRecords);
            }
console.log(affectedRecords);

        return affectedRecords;
}

const sendCustomerCreationMail = async (Users) =>
{
    try 
    {   
        let mailMessage, template, mailOptions, info;
         let Sub='';
        for(let i = 0; i < Users.length; i++)
        { 
            
                Sub=`User Resgistration Successful`;
                mailMessage =  `
                To, <br>`+Users[i].FNAME+` `+Users[i].LNAME+`<br>`+ Users[i].OFFICENM+`<br><br> You have successfully registered with Excell Investigation. 
                <br> Use below credentials for Login 
                <br> User Id ->`+Users[i].USRID+` 
                <br> Password ->`+ Users[i].PWDRD+`
                <br> Login URL :- http://81.4.102.11:7001/customersignin
                <br><br> If you need assistance, please call us directly at 1.888.666.0089 
                <br> We will be more than happy to assist you. 
                <div><br><b>Thank you</b>
                <br><b>Support Team</b>
                <br><b>Excell Investigations</b>
                <br><b>www.excellinvestigations.net</b></div>
            `;
            
            template = emailTemplateServices.emailTemplate(mailMessage);

            mailOptions = {
                from : `Excell Support <support@excellinvestigation.com>`,
                to : Users[i].UMAIL,
                cc : ``,        
                subject : Sub,
                html : template,
                attachments : []
            };
    
    
            info = await emailServices.sendEmails(mailOptions); 
            console.log(info);  
    
        }

    } 
    catch (error) 
    {
        return error;    
    }
}



// Resolver function for query searchPassword(input) : [TResponse]
const searchPassword = async (args, context, info) =>
{
    
    
    try 
    {
       
        let selectQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.APPLICATIONID !== 'undefined' && args.APPLICATIONID.trim())              ?   args.APPLICATIONID.trim()          : '',
            (typeof args.CLIENT !== 'undefined' && args.CLIENT.trim())              ?   args.CLIENT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.USERNAME !== 'undefined' && args.USERNAME.trim())            ?   args.USERNAME.trim()         : '',
            
        ];
    
            console.log(placeHolders);
            
            sendForgotPasswordMail("Kedar Lachke", "itss","kedarlachke1@gmail.com");
    
        // Use database service to get table data
        //let result = await dbServices.getTableData(selectQuery, placeHolders) ;
        let TResponse=[{
        TSTATUS       : 'SUCCESS',
        SUCCESS_MSG   : 'MAIL SENT',
        FAIL_MSG       : ''
    }];

     
     
        return TResponse;        
    } 
    catch (error) 
    {
        return error;    
    }

}

const sendForgotPasswordMail = async (fullname,organization,toemail) =>
{
    try 
    {   
        let mailMessage, template, mailOptions, info;
         let Sub='Forgot Password ExcellInvestigation';
               
               
            mailMessage =  `
                To, <br>`+fullname+`<br>`+organization+`<br><br> We have received your request for Excell Investigation credentails. 
                <br> Excell Credentials :
                <br> User Id -> exuser
                <br> Password -> abc123 
                <br><br> If this is urgent and you need immediate assistance, please call us directly at 1.888.666.0089 
                <br><br> We will be more than happy to assist you. 
                <<br><br><b>Thank you</b>
                <br><b>Support Team</b>
                <br><b>Excell Investigations</b>
                <br><b>www.excellinvestigations.net</b>
            `;
            
            template = emailTemplateServices.emailTemplate(mailMessage);

            mailOptions = {
                from : `Excell Support <customercare@excellinvestigation.com>`,
                to : toemail,
                cc : ``,        
                subject : Sub,
                html : template,
                attachments : []
            };
    
    
            info = await emailServices.sendEmails(mailOptions); 
            //console.log(info);  
    
        }

     
    catch (error) 
    {
        return error;    
    }
}
// Export functions
module.exports = {
    searchUsers,
    searchAuthorizations,
    userDetails,
    UsersCRUDOps,
    updateUserAuthorizations,
    SignUpCustomerUsername,
    SignUpCustomerUsernameJWT,
    searchPassword
};


