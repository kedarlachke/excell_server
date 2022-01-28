/**
 * @author 
 */

// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import {
    searchDashboardTasksQuery, 
    searchAdminTasksQuery, 
    searchUserTasksQuery, 
    searchLoggedUserTasksQuery, 
    searchLoggedUserDashboardTasksQuery,
    checkDuplicateTasksQuery,
    getTaskDetailsQuery
} from '../common/sqlQueries';


// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchDashboardTasks(input) : [Tasks]
const searchDashboardTasks = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = searchDashboardTasksQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : ''
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


// Resolver function for query searchTasks(input) : [Tasks]
const searchTasks = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let isAdmin = args.isAdmin;
        let selectQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : ''
        ];
    
        if(isAdmin)
        {
            selectQuery = searchAdminTasksQuery;

            // Add placeholders for additional values 
            placeHolders.push(
                (typeof args.STATUS !== 'undefined' && args.STATUS.trim())      ?   args.STATUS.trim()      : '%%',            
                (typeof args.SUBJECT !== 'undefined' && args.SUBJECT.trim())      ?   args.SUBJECT.trim()      : '%%',            
                (typeof args.TASKFOR !== 'undefined' && args.TASKFOR.trim())      ?   args.TASKFOR.trim()      : '%%',           
                (typeof args.PRIORITYID !== 'undefined' && args.PRIORITYID.trim())      ?   args.PRIORITYID.trim()      : '%%',            
                (typeof args.FROMDATE !== 'undefined' && args.FROMDATE.trim())      ?   args.FROMDATE.trim()      : '',            
                (typeof args.TODATE !== 'undefined' && args.TODATE.trim())      ?   args.TODATE.trim()      : '',
                (typeof args.TASKOF !== 'undefined' && args.TASKOF.trim())      ?   args.TASKOF.trim()      : '%%',            
                (typeof args.TASKOFID !== 'undefined' && args.TASKOFID.trim())  ?   args.TASKOFID.trim()      : '%%'
            );

        }
        else
        {
            selectQuery = searchUserTasksQuery;
    
            // Add placeholders for additional values 
            placeHolders.push(
                                (typeof args.CUSER !== 'undefined' && args.CUSER.trim()) ? args.CUSER.trim() : ''
                            );
            
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


// Resolver function for query searchLoggedUserTasks(input) : [Tasks]
const searchLoggedUserTasks = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let isDashboard = args.isDashboard;
        let selectQuery;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.TASKFOR !== 'undefined' && args.TASKFOR.trim())        ?   args.TASKFOR.trim()       : ''
        ];

        if(isDashboard)
        {
            selectQuery = searchLoggedUserDashboardTasksQuery;
        }
        else
        {
            selectQuery = searchLoggedUserTasksQuery;            

            // Add placeholders for additional values 
            placeHolders.push(
                (typeof args.STATUS !== 'undefined' && args.STATUS.trim())      ?   args.STATUS.trim()      : '%%',
                (typeof args.SUBJECT !== 'undefined' && args.SUBJECT.trim())      ?   args.SUBJECT.trim()      : '%%',            
                (typeof args.TASKOWNER !== 'undefined' && args.TASKOWNER.trim())      ?   args.TASKOWNER.trim()      : '%%',           
                (typeof args.PRIORITYID !== 'undefined' && args.PRIORITYID.trim())      ?   args.PRIORITYID.trim()      : '%%',            
                (typeof args.FROMDATE !== 'undefined' && args.FROMDATE.trim())      ?   args.FROMDATE.trim()      : '',            
                (typeof args.TODATE !== 'undefined' && args.TODATE.trim())      ?   args.TODATE.trim()      : '',
                (typeof args.TASKOF !== 'undefined' && args.TASKOF.trim())      ?   args.TASKOF.trim()      : '%%',            
                (typeof args.TASKOFID !== 'undefined' && args.TASKOFID.trim())  ?   args.TASKOFID.trim()      : '%%'
            );
            
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


// Resolver function for query taskDetails(input) : [Task]
const taskDetails = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getTaskDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())      ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())      ?   args.LANG.trim()          : '',
            (typeof args.TASKID !== 'undefined' && args.TASKID.trim())    ?   args.TASKID.trim()         : ''
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
 * CRUD Operations for Tasks
 **/
// Resolver function for mutation TasksCRUDOps(input) : String
const TasksCRUDOps = async (args, context, info) =>
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
            let tasks = await validateCREATEData(args.tasks);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateTasks(tasks);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createTasks(tasks);
            }

        }   
        else if(transaction == "UPDATE")    // Update
        {

            // Validate input data
            let tasks = await validateUPDATEData(args.tasks);

            // Check availability of records
            let duplicateObj =  await checkDuplicateTasks(tasks);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != tasks.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await updateTasks(tasks);
            }

        }   
        else if(transaction == "LOGICAL_DELETE")    // Logical delete
        {

            // Validate input data
            let tasks = await validateDELETEData(args.tasks);

            // Check availability of records
            let duplicateObj =  await checkDuplicateTasks(tasks);

            // if all goes well, then update records
            if(parseInt(duplicateObj.duplicateCount) != tasks.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await logicalDeleteTasks(tasks);
            }

        }   
        else if(transaction == "PHYSICAL_DELETE")   // Physical delete
        {

            // Validate input data
            let tasks = await validateDELETEData(args.tasks);

            // Check availability of records
            let duplicateObj =  await checkDuplicateTasks(tasks);

            // if all goes well, then delete records
            if(parseInt(duplicateObj.duplicateCount) != tasks.length)
            {
                throw new Error(duplicateObj.recordsNotFoundMessage);
            }
            else
            {
                affectedRecords = await physicalDeleteTasks(tasks);
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
const validateCREATEData = async (tasks) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < tasks.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", tasks[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", tasks[i].LANG, "Language is required", validationObject);
            validations.checkNull("SUBJECT", tasks[i].SUBJECT, "Subject is required", validationObject);
            validations.checkNull("TASKOF", tasks[i].TASKOF, "Task of is required", validationObject);
            validations.checkNull("TASKOFID", tasks[i].TASKOFID, "Task of ID is required", validationObject);
            //validations.checkNull("TASKDETAILS", tasks[i].TASKDETAILS, "Task Details are required", validationObject);
            validations.checkNull("PRIORITYID", tasks[i].PRIORITYID, "Priority is required", validationObject);
            validations.checkNull("STATUSID", tasks[i].STATUSID, "Status is required", validationObject);

            validations.checkMaxLength("TASKOF", tasks[i].TASKOF, 20, "Length of Task of should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("TASKOFID", tasks[i].TASKOFID, 20, "Length of Task of ID should be less than or equal to 20 characters", validationObject);            
            validations.checkMaxLength("SUBJECT", tasks[i].SUBJECT, 60, "Length of Subject should be less than or equal to 60 characters", validationObject);
            validations.checkMaxLength("TASKDETAILS", tasks[i].TASKDETAILS, 2048, "Length of Task details should be less than or equal to 2048 characters", validationObject);

            validations.checkDate("STARTDATE", tasks[i].STARTDATE, "YYYYMMDD", "Invalid Date", validationObject);
            validations.checkDate("DUEDATE", tasks[i].DUEDATE, "YYYYMMDD", "Invalid Date", validationObject);

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
            
            for(let i = 0; i < tasks.length; i++)
            {
                // Get auto-generated number for tasks id
                nextNumber = await numberSeries.getNextSeriesNumber(tasks[i].CLNT, "NA", "TASKID");
                
                // Add auto-generated number as tasks id
                tasks[i].TASKID = nextNumber;
                

                // Add create params 
                tasks[i].CDATE = curDate;
                tasks[i].CTIME = curTime;
                tasks[i].ISDEL = "N";
                tasks[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return tasks;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for updation
const validateUPDATEData = async (tasks) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < tasks.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", tasks[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", tasks[i].LANG, "Language is required", validationObject);
            validations.checkNull("TASKID", tasks[i].TASKID, "Task ID is required", validationObject);
            validations.checkNull("SUBJECT", tasks[i].SUBJECT, "Subject is required", validationObject);
            validations.checkNull("TASKOF", tasks[i].TASKOF, "Task of is required", validationObject);
            validations.checkNull("TASKOFID", tasks[i].TASKOFID, "Task of ID is required", validationObject);
            //validations.checkNull("TASKDETAILS", tasks[i].TASKDETAILS, "Task Details are required", validationObject);
            validations.checkNull("PRIORITYID", tasks[i].PRIORITYID, "Priority is required", validationObject);
            validations.checkNull("STATUSID", tasks[i].STATUSID, "Status is required", validationObject);

            validations.checkMaxLength("TASKOF", tasks[i].TASKOF, 20, "Length of Task of should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("TASKOFID", tasks[i].TASKOFID, 20, "Length of Task of ID should be less than or equal to 20 characters", validationObject);
            validations.checkMaxLength("SUBJECT", tasks[i].SUBJECT, 60, "Length of Subject should be less than or equal to 60 characters", validationObject);
            validations.checkMaxLength("TASKDETAILS", tasks[i].TASKDETAILS, 2048, "Length of Task details should be less than or equal to 2048 characters", validationObject);

            validations.checkDate("STARTDATE", tasks[i].STARTDATE, "YYYYMMDD", "Invalid Date", validationObject);
            validations.checkDate("DUEDATE", tasks[i].DUEDATE, "YYYYMMDD", "Invalid Date", validationObject);

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
            
            for(let i=0; i<tasks.length; i++)
            {                
                // Add update params 
                tasks[i].UDATE = curDate;
                tasks[i].UTIME = curTime;
                tasks[i].UUSER = loginUser.USERID.toLowerCase();        
            }
        
            return tasks;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Validation funtion for deletion
const validateDELETEData = async (tasks) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < tasks.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", tasks[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", tasks[i].LANG, "Language is required", validationObject);
            validations.checkNull("TASKID", tasks[i].TASKID, "Task ID is required", validationObject);

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
            
            for(let i=0; i<tasks.length; i++)
            {                
                // Add delete params 
                tasks[i].DDATE = curDate;
                tasks[i].DTIME = curTime;
                tasks[i].DUSER = loginUser.USERID.toLowerCase();        
            }
        
            return tasks;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateTasks = async (tasks) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < tasks.length; i++)
        {
            placeHolders = [
                (typeof tasks[i].CLNT !== 'undefined' && tasks[i].CLNT.trim())        ?   tasks[i].CLNT.trim()    : '',
                (typeof tasks[i].LANG !== 'undefined' && tasks[i].LANG.trim())        ?   tasks[i].LANG.trim()    : '',
                (typeof tasks[i].TASKID !== 'undefined' && tasks[i].TASKID.trim())      ?   tasks[i].TASKID.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateTasksQuery, placeHolders)
            
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


// function for creating tasks records
const createTasks = async (tasks) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < tasks.length; i++)
        {
            // form the data json
            dataJSON = tasks[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("T_TASKS", dataJSON);
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


// function for updating tasks records
const updateTasks = async (tasks) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < tasks.length; i++)
        {
            // form the data json
            dataJSON = tasks[i];
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   tasks[i].CLNT,
                "LANG"    :   tasks[i].LANG,
                "TASKID"  :	  tasks[i].TASKID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("T_TASKS", dataJSON, clauseJSON);
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


// function for logically deleting tasks records
const logicalDeleteTasks = async (tasks) =>
{
    try 
    {   
        let updateStatement;             
        let updateStatements = [] ;
        let dataJSON;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < tasks.length; i++)
        {
            // form the data json
            dataJSON = {
                "ISDEL"   :   "Y",
                "DDATE"	  :   tasks[i].DDATE,
                "DTIME"	  :   tasks[i].DTIME,
                "DUSER" : loginUser.USERID.toLowerCase()
            }
        
            // form the clause json
            clauseJSON = {
                "CLNT"    :   tasks[i].CLNT,
                "LANG"    :   tasks[i].LANG,
                "TASKID"  :	  tasks[i].TASKID
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("T_TASKS", dataJSON, clauseJSON);
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


// function for phyically deleting tasks records
const physicalDeleteTasks = async (tasks) =>
{
    try 
    {   
        let deleteStatement;             
        let deleteStatements = [] ;
        let clauseJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < tasks.length; i++)
        {
            // form the caluse json
            clauseJSON = {
                "CLNT"    :   tasks[i].CLNT,
                "LANG"    :   tasks[i].LANG,
                "TASKID"  :	  tasks[i].TASKID
            }

            // Get the delete statement
            deleteStatement = await dbServices.getDeleteStatement("T_TASKS", clauseJSON);
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
    searchDashboardTasks,
    searchTasks,
    searchLoggedUserTasks,
    taskDetails,
    TasksCRUDOps
};

