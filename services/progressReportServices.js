/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    searchProgressReportsQuery,
    getProgressReportDetailsQuery,
    checkDuplicateProgressReportsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchProgressReports(input) : [ProgressReport]
const searchProgressReports = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchProgressReportsQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.PRGRPTID !== 'undefined' && args.PRGRPTID.trim())      ?   args.PRGRPTID.trim()      : '%%',
            (typeof args.CUSER !== 'undefined' && args.CUSER.trim())            ?   args.CUSER.trim()         : '%%',
            (typeof args.RPTTXT !== 'undefined' && args.RPTTXT.trim())          ?   args.RPTTXT.trim()        : '%%',
            (typeof args.FRMDATE !== 'undefined' && args.FRMDATE.trim())        ?   args.FRMDATE.trim()         : '',
            (typeof args.TODATE !== 'undefined' && args.TODATE.trim())          ?   args.TODATE.trim()          : '',
            (typeof args.CIDSYS !== 'undefined' && args.CIDSYS.trim())          ?   args.CIDSYS.trim()         : ''
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


// Resolver function for query progressReportDetails(input) : [ProgressReport]
const progressReportDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getProgressReportDetailsQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.PRGRPTID !== 'undefined' && args.PRGRPTID.trim())      ?   args.PRGRPTID.trim()      : ''
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


/**
 * CRUD Operations for ProgressReport
 **/
// Resolver function for mutation ProgressReportCRUDOps(input) : String
const ProgressReportCRUDOps = async (args, context, info) =>
{
    console.log('1234')
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
            let progressreports = await validateCREATEData(args.progressreports, context);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateProgressReports(progressreports);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createProgressReports(progressreports);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let progressreports = await validateUPDATEData(args.progressreports, context);

            // Check availability of records
            let duplicateObj =  await checkDuplicateProgressReports(progressreports);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != progressreports.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateProgressReports(progressreports);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let progressreports = await validateDELETEData(args.progressreports);

            // Check availability of records
            let duplicateObj =  await checkDuplicateProgressReports(progressreports);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != progressreports.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteProgressReports(progressreports);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let progressreports = await validateDELETEData(args.progressreports);

            // Check availability of records
            let duplicateObj =  await checkDuplicateProgressReports(progressreports);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != progressreports.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteProgressReports(progressreports);
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
const validateCREATEData = async (progressreports, context) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let validationObjects = {};

        for(let i = 0; i < progressreports.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", progressreports[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", progressreports[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", progressreports[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("RPTTXT", progressreports[i].RPTTXT, "Details are required", validationObject);
            validations.checkNull("WORKHOURS", progressreports[i].WORKHOURS, "Work Hours are required", validationObject);
            validations.checkNull("CDOCTYPE", progressreports[i].CDOCTYPE, "Select Document Type", validationObject);

            validations.checkMaxLength("RPTTXT", progressreports[i].RPTTXT, 200, "Length of Details should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("WORKHOURS", progressreports[i].WORKHOURS, 4, "Length of Work Hours should be less than or equal to 4 characters", validationObject);

            validations.checkNumber("WORKHOURS", progressreports[i].WORKHOURS, "Work Hours should be a number", validationObject);

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
            let nextNumber, nextNumber2;
            let files = context.request.files || [];
            let file;
            let documentID = "0";

            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i = 0; i < progressreports.length; i++)
            {
                // Get auto-generated number for progressreports id
                nextNumber = await numberSeries.getNextSeriesNumber(progressreports[i].CLNT, "NA", "PGRSRP");

                // Get auto-generated number for progressreports work id
                nextNumber2 = await numberSeries.getNextSeriesNumber(progressreports[i].CLNT, "NA", "PGRSWR");
                
                // Add auto-generated number as progressreports id
                progressreports[i].PRGRPTID = nextNumber;

                // Add auto-generated number as progressreports work id
                progressreports[i].PRGWORKID = nextNumber2;
                

                // Add create params 
                progressreports[i].CDATE = curDate;
                progressreports[i].CTIME = curTime;
                progressreports[i].ISDEL = "N";
                progressreports[i].CUSER = loginUser.USERID.toLowerCase();
                
                if(files.length != 0)
                {
                    for( let i = 0 ; i < files.length; i++)
                    {
                        file = files[i];
                        //documentID = await numberSeries.getNextSeriesNumber(progressreports[i].CLNT, "0100", "IMGSRN");

                        //progressreports[i].DOCID = documentID;
                        progressreports[i].CDOC = file.buffer;
                        progressreports[i].DOCNM = file.originalname;
                        progressreports[i].CEXTENSION = file.mimetype;

                    }        
                }

            }
        
            return progressreports;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (progressreports, context) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let validationObjects = {};

        for(let i = 0; i < progressreports.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", progressreports[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", progressreports[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", progressreports[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("PRGRPTID", progressreports[i].PRGRPTID, "Progress Report ID are required", validationObject);
            validations.checkNull("PRGWORKID", progressreports[i].PRGWORKID, "Progress Report Work ID are required", validationObject);
            validations.checkNull("RPTTXT", progressreports[i].RPTTXT, "Details are required", validationObject);
            validations.checkNull("WORKHOURS", progressreports[i].WORKHOURS, "Work Hours are required", validationObject);
            validations.checkNull("CDOCTYPE", progressreports[i].CDOCTYPE, "Select Document Type", validationObject);

            validations.checkMaxLength("RPTTXT", progressreports[i].RPTTXT, 200, "Length of Details should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("WORKHOURS", progressreports[i].WORKHOURS, 4, "Length of Work Hours should be less than or equal to 4 characters", validationObject);

            validations.checkNumber("WORKHOURS", progressreports[i].WORKHOURS, "Work Hours should be a number", validationObject);

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

            let files = context.request.files || [];
            let file;
            let documentID = "0";

            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();
            
            for(let i=0; i<progressreports.length; i++)
            {                
                // Add update params 
                progressreports[i].UDATE = curDate;
                progressreports[i].UTIME = curTime        
                progressreports[i].UUSER = loginUser.USERID.toLowerCase();

                if(files.length != 0)
                {
                    for( let i = 0 ; i < files.length; i++)
                    {
                        file = files[i];
                        //documentID = await numberSeries.getNextSeriesNumber(progressreports[i].CLNT, "0100", "IMGSRN");

                        //progressreports[i].DOCID = documentID;
                        progressreports[i].CDOC = file.buffer;
                        progressreports[i].DOCNM = file.originalname;
                        progressreports[i].CEXTENSION = file.mimetype;

                    }        
                }

            }
        
            return progressreports;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (progressreports) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < progressreports.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", progressreports[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", progressreports[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", progressreports[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("PRGRPTID", progressreports[i].PRGRPTID, "Progress Report ID are required", validationObject);
            validations.checkNull("PRGWORKID", progressreports[i].PRGWORKID, "Progress Report Work ID are required", validationObject);

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
            
            for(let i=0; i<progressreports.length; i++)
            {                
                // Add delete params 
                progressreports[i].DDATE = curDate;
                progressreports[i].DTIME = curTime;
                progressreports[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return progressreports;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateProgressReports = async (progressreports) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < progressreports.length; i++)
        {
            placeHolders = [
                (typeof progressreports[i].CLNT !== 'undefined' && progressreports[i].CLNT.trim())        ?   progressreports[i].CLNT.trim()    : '',
                (typeof progressreports[i].LANG !== 'undefined' && progressreports[i].LANG.trim())        ?   progressreports[i].LANG.trim()    : '',
                (typeof progressreports[i].PRGRPTID !== 'undefined' && progressreports[i].PRGRPTID.trim())      ?   progressreports[i].PRGRPTID.trim()   : '',
                (typeof progressreports[i].PRGWORKID !== 'undefined' && progressreports[i].PRGWORKID.trim())      ?   progressreports[i].PRGWORKID.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateProgressReportsQuery, placeHolders)
            
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


// function for creating progressreports records
const createProgressReports = async (progressreports) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        let documents = [];
        for(let i = 0; i < progressreports.length; i++)
        {
            // save file buffer to new object
            documents[i] = {
                "PRGWORKID" : progressreports[i].PRGWORKID,
                "CDOC" : progressreports[i].CDOC
            };

            // remove file buffer from original object
            delete progressreports[i].CDOC;
        }

        for(let i = 0; i < progressreports.length; i++)
        {
            // form the data json
            dataJSON = progressreports[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TPROGRESSWORK", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);


        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        if(affectedRecords != 0)
        {
            /*let valuesArray = [];
            for(let i = 0; i < progressreports.length; i++)
            {
                valuesArray.push(progressreports[i].CLNT);
                valuesArray.push(progressreports[i].LANG);
                valuesArray.push(progressreports[i].CIDSYS);

                // Call database procedure
                //let procRes = await dbServices.executeStoredProcedure('SET @MSG = "0"; CALL TestProc(?,?,?,@MSG); SELECT @MSG', valuesArray);
                //console.log(procRes[procRes.length-1]);

                let procRes = await dbServices.executeStoredProcedure('CALL PRO_PROGRESSRPT(?,?,?)', valuesArray);
                //console.log(procRes[procRes.length-1]);

                valuesArray.length = 0;
            } */   

            // save file buffer to database
            createDocuments(documents);

        }


        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for updating progressreports records
const updateProgressReports = async (progressreports) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        let documents = [];
        for(let i = 0; i < progressreports.length; i++)
        {
            // save file buffer to new object
            documents[i] = {
                "PRGWORKID" : progressreports[i].PRGWORKID,
                "CDOC" : progressreports[i].CDOC
            };

            // remove file buffer from original object
            delete progressreports[i].CDOC;
        }


        for(let i = 0; i < progressreports.length; i++)
        {
            // form the data json
            dataJSON = progressreports[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   progressreports[i].CLNT,
                "LANG"    :   progressreports[i].LANG,
                "PRGRPTID"  :	  progressreports[i].PRGRPTID,
                "PRGWORKID"  :	  progressreports[i].PRGWORKID
            };

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TPROGRESSWORK", dataJSON, clauseJSON);
            updateStatements.push(updateStatement);
            //console.log("updateStatement => ");  console.log(updateStatement);
        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(updateStatements);

        if(affectedRecords != 0)
        {
            /*let valuesArray = [];
            for(let i = 0; i < progressreports.length; i++)
            {
                valuesArray.push(progressreports[i].CLNT);
                valuesArray.push(progressreports[i].LANG);
                valuesArray.push(progressreports[i].CIDSYS);

                // Call database procedure
                //let procRes = await dbServices.executeStoredProcedure('SET @MSG = "0"; CALL TestProc(?,?,?,@MSG); SELECT @MSG', valuesArray);
                //console.log(procRes[procRes.length-1]);

                let procRes = await dbServices.executeStoredProcedure('CALL PRO_PROGRESSRPT(?,?,?)', valuesArray);
                //console.log(procRes[procRes.length-1]);

                valuesArray.length = 0;
            }  */  

            // save file buffer to database
            createDocuments(documents);

        }

        return affectedRecords;        
    } 
    catch (error) 
    {
        return error;    
    }
}


// function for logically deleting progressreports records
const logicalDeleteProgressReports = async (progressreports) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < progressreports.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   progressreports[i].DDATE,
                "DTIME"	  :   progressreports[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   progressreports[i].CLNT,
                "LANG"    :   progressreports[i].LANG,
                "PRGRPTID"  :	  progressreports[i].PRGRPTID,
                "PRGWORKID"  :	  progressreports[i].PRGWORKID
            };

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TPROGRESSWORK", dataJSON, clauseJSON);
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


// function for phyically deleting progressreports records
const physicalDeleteProgressReports = async (progressreports) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < progressreports.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   progressreports[i].CLNT,
                "LANG"    :   progressreports[i].LANG,
                "PRGRPTID"  :	  progressreports[i].PRGRPTID,
                "PRGWORKID"  :	  progressreports[i].PRGWORKID
            };

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("TPROGRESSWORK", clauseJSON);
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


// function for creating documents
const createDocuments = async (documents) =>
{
    try 
    {         
        let valuesArray = [];
        let updateDML;
        let recordsUpdated = 0;

        for(let i = 0; i < documents.length; i++)
        {
            updateDML = `
                UPDATE TPROGRESSWORK
                SET ? WHERE PRGWORKID = `+documents[i].PRGWORKID+`
            `;

            valuesArray = [documents[i]];

            // Use database service to update records in table 
            recordsUpdated = recordsUpdated  + await dbServices.updateTableRecords(updateDML, valuesArray) ;
            //console.log("result => ");  console.log(result);            
        }

        return recordsUpdated;        

    } 
    catch (error) 
    {
        throw error;    
    }

}


/**
 * Update Progress Work against Invoice
 **/
// Resolver function for updating progress work against invoice created
const UpdateProgressAgainstInvoice = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);

        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        let progressreports = args.progressreports;

        let validationObjects = {};

        for(let i = 0; i < progressreports.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", progressreports[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", progressreports[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", progressreports[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("PRGRPTID", progressreports[i].PRGRPTID, "Progress Report ID are required", validationObject);
            validations.checkNull("PRGWORKID", progressreports[i].PRGWORKID, "Progress Report Work ID are required", validationObject);
            validations.checkNull("LINEITEMNO", progressreports[i].LINEITEMNO, "Line item no is required", validationObject);
            validations.checkNull("DOCID", progressreports[i].DOCID, "Doc ID required", validationObject);

            validations.checkMaxLength("LINEITEMNO", progressreports[i].LINEITEMNO, 10, "Length of Line item no should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("DOCID", progressreports[i].DOCID, 12, "Length of Doc ID should be less than or equal to 12 characters", validationObject);

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }



        for(let i = 0; i < progressreports.length; i++)
        {

            // form the data json
            dataJSON = {
               "DOCID"          : progressreports[i].DOCID,
               "LINEITEMNO"     : progressreports[i].LINEITEMNO,
               "UDATE" : sysDateTime.sysdate_yyyymmdd(),
               "UTIME" : sysDateTime.systime_hh24mmss(),
               "UUSER" : loginUser.USERID.toLowerCase()
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"      :   progressreports[i].CLNT,
                "LANG"      :   progressreports[i].LANG,
                "CIDSYS"    :   progressreports[i].CIDSYS,
                "PRGRPTID"  :	  progressreports[i].PRGRPTID,
                "PRGWORKID"  :	  progressreports[i].PRGWORKID                
            };


            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TPROGRESSWORK", dataJSON, clauseJSON);
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



/**
 * Toggle Prgress Work Billing Status
 **/
// Resolver function for toggling billing status of progress work 
const ToggleProgressWorkBilling = async (args, context, info) =>
{
    try 
    {   
        loginUser = validations.getLoginData(context);
        
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        let progressreports = args.progressreports;

        let validationObjects = {};

        for(let i = 0; i < progressreports.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", progressreports[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", progressreports[i].LANG, "Language is required", validationObject);
            validations.checkNull("CIDSYS", progressreports[i].CIDSYS, "Case ID is required", validationObject);
            validations.checkNull("PRGRPTID", progressreports[i].PRGRPTID, "Progress Report ID are required", validationObject);
            validations.checkNull("PRGWORKID", progressreports[i].PRGWORKID, "Progress Report Work ID are required", validationObject);
            validations.checkNull("ISBILLED", progressreports[i].ISBILLED, "Billing indicator is required", validationObject);

            validations.checkMaxLength("ISBILLED", progressreports[i].ISBILLED, 1, "Length of Billing indicator should be less than or equal to 1 characters", validationObject);

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }


        for(let i = 0; i < progressreports.length; i++)
        {

            // form the data json
            dataJSON = {
               "ISBILLED" : progressreports[i].ISBILLED,
               "UDATE"  : sysDateTime.sysdate_yyyymmdd(),
               "UTIME"  : sysDateTime.systime_hh24mmss(),
               "UUSER" : loginUser.USERID.toLowerCase()
            };
        
            // form the clause json
            clauseJSON = {
                "CLNT"      :   progressreports[i].CLNT,
                "LANG"      :   progressreports[i].LANG,
                "CIDSYS"    :   progressreports[i].CIDSYS,
                "PRGRPTID"  :	  progressreports[i].PRGRPTID,
                "PRGWORKID"  :	  progressreports[i].PRGWORKID                
            };


            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TPROGRESSWORK", dataJSON, clauseJSON);
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


// Export functions
module.exports = {
    searchProgressReports,
    progressReportDetails,
    ProgressReportCRUDOps,
    UpdateProgressAgainstInvoice,
    ToggleProgressWorkBilling
};

