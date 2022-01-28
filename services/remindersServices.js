/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import { isNullOrUndefined } from 'util';
import emailServices from '../services/emailServices';
import emailTemplateServices from '../services/emailTemplateServices';

import {
    checkDuplicateReminderQuery,
    getInvoiceForReminderQuery,
    getContractDetailsQuery
} from '../common/sqlQueries';

const pdf=require('html-pdf')
const pdftempate=require('./HtmlTemplate')
// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


// Resolver function for query searchTasks(input) : [Tasks]
const invoiceDetailsForReminder = async (args, context, info) =>
{
    try 
    {
        loginUser = validations.getLoginData(context);

        let selectQuery = getInvoiceForReminderQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (typeof args.CLNT !== 'undefined' && args.CLNT.trim())              ?   args.CLNT.trim()          : '',
            (typeof args.LANG !== 'undefined' && args.LANG.trim())              ?   args.LANG.trim()          : '',
            (typeof args.DOCID !== 'undefined' && args.DOCID.trim())            ?   args.DOCID.trim()          : ''

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

const contractDetails = async (CLNT,LANG,CIDSYS) =>
{
    try 
    {
        

        let selectQuery = getContractDetailsQuery;

        // Placeholders for prepared query
        let placeHolders = [
            (CLNT   !== 'undefined' && CLNT.trim())    ?  CLNT.trim()  : '',
            (LANG   !== 'undefined' && LANG.trim())    ?  LANG.trim()  : '',
            (CIDSYS !== 'undefined' && CIDSYS.trim())  ?  CIDSYS.trim(): ''
        ];
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        // Convert Blob Buffer to String
        if(result.length !=0)
        {
            let customContractBuffer = result[0].CUSTOMCON;
    
            if(!isNullOrUndefined(customContractBuffer))
                result[0].CUSTOMCON = Buffer.from(customContractBuffer).toString();

        }

        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}

/**
 * CRUD Operations for Reminders
 **/
// Resolver function for mutation RemindersCRUDOps(input) : String
const RemindersCRUDOps = async (args, context, info) =>
{  //const {CLNT,LANG,CIDSYS} =args[0]

    let contractdata=await contractDetails(args.reminders[0].CLNT,args.reminders[0].LANG,args.reminders[0].CIDSYS)
    
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
            let reminders = await validateCREATEData(args.reminders);

            // Check uniqueness of input data
            let duplicateObj =  await checkDuplicateReminders(reminders);

            // if all goes well, then create records
            if(duplicateObj.isDuplicate)
            {
                throw new Error(duplicateObj.duplicateRecordsMessage);
            }
            else
            {
                affectedRecords = await createReminders(reminders,contractdata);
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
const validateCREATEData = async (reminders) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < reminders.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", reminders[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", reminders[i].LANG, "Language is required", validationObject);
            validations.checkNull("DOCID", reminders[i].DOCID, "Document ID required", validationObject);
            validations.checkNull("CMESSAGE", reminders[i].CMESSAGE, "Message is required", validationObject);
            validations.checkNull("CSUBJECT", reminders[i].CSUBJECT, "Subject is required", validationObject);
            validations.checkNull("CTO", reminders[i].CTO, "To is required", validationObject);
            validations.checkNull("CFORM", reminders[i].CFORM, "From is required", validationObject);

            validations.checkMaxLength("CTO", reminders[i].CTO, 100, "Length of To should be less than or equal to 100 characters", validationObject);
            validations.checkMaxLength("CFORM", reminders[i].CFORM, 50, "Length of From should be less than or equal to 50 characters", validationObject);
            validations.checkMaxLength("DOCID", reminders[i].DOCID, 10, "Length of Doc ID should be less than or equal to 10 characters", validationObject);
            validations.checkMaxLength("CSUBJECT", reminders[i].CSUBJECT, 200, "Length of Subject should be less than or equal to 200 characters", validationObject);
            validations.checkMaxLength("CMESSAGE", reminders[i].CMESSAGE, 500, "Length of Subject should be less than or equal to 500 characters", validationObject);

            validations.checkEmail("CTO", reminders[i].CTO, "Email id is not valid", validationObject);
            validations.checkEmail("CFORM", reminders[i].CFORM, "Email id is not valid", validationObject);

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
            
            for(let i = 0; i < reminders.length; i++)
            {
                // Get auto-generated number for reminders id
                nextNumber = await numberSeries.getNextSeriesNumber(reminders[i].CLNT, "NA", "REMNO");
                
                // Add auto-generated number as reminders id
                reminders[i].REMNO = nextNumber;
                

                // Add create params 
                reminders[i].CDATE = curDate;
                reminders[i].CTIME = curTime;
                reminders[i].ISDEL = "N";
                reminders[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return reminders;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// Function to check uniqueness of data
const checkDuplicateReminders = async (reminders) =>
{
    try 
    {
        // Placeholders for prepared query
        let placeHolders = [];
        let result;
        let duplicateRecordsMessage = "";
        let recordsNotFoundMessage = "";
        let duplicateCount = 0;
    
        for(let i = 0; i < reminders.length; i++)
        {
            placeHolders = [
                (typeof reminders[i].CLNT !== 'undefined' && reminders[i].CLNT.trim())        ?   reminders[i].CLNT.trim()    : '',
                (typeof reminders[i].LANG !== 'undefined' && reminders[i].LANG.trim())        ?   reminders[i].LANG.trim()    : '',
                (typeof reminders[i].REMNO !== 'undefined' && reminders[i].REMNO.trim())      ?   reminders[i].REMNO.trim()   : ''
            ];
    
            result = await dbServices.getTableData(checkDuplicateReminderQuery, placeHolders)
            
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



// function for creating reminders records
const createReminders = async (reminders,contractdata) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < reminders.length; i++)
        {
            // form the data json
            dataJSON = {
                "CLNT"    :	reminders[i].CLNT,
                "LANG"    :	reminders[i].LANG,
                "REMNO"   :	reminders[i].REMNO,
                "DOCID"   :	reminders[i].DOCID,
                "CFORM"   :	reminders[i].CFORM,
                "CTO"         :	reminders[i].CTO,
                "CSUBJECT"    :	reminders[i].CSUBJECT,
                "CMESSAGE"    :	reminders[i].CMESSAGE,
                "DUEAMT"      :	reminders[i].DUEAMT,
                "CDATE"     :  reminders[i].CDATE,
                "CTIME"     :  reminders[i].CTIME,
                "CUSER"     :  loginUser.USERID.toLowerCase(),
                "ISDEL"     :  reminders[i].ISDEL
            };

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("TREMAINDER", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        if(affectedRecords != 0)
            sendReminderMail(reminders,contractdata);

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for sending emails after reminder creation
const sendReminderMail = async (reminders,contractdata) =>
{
    console.log('in remider wqe')
    try 
    {   
        let template, mailOptions, info, selectQuery, invoiceInfo ,invoice;
        let payid, urlParams;
        let payurl = "http://excellinvestigations.net:8080/ExcelInv2/zulfile/PaymentView/Invoicepayment.zul?";

        for(let i = 0; i < reminders.length; i++)
        {
            
            payid = reminders[i].CLNT+"_"+"ssid"+"_"+reminders[i].CUSTCD+
                    "_"+"******"+"_"+"INVOICE"+"_"+reminders[i].DOCID
            
            urlParams = "paymentid="+payid+"&amount="+reminders[i].DUEAMT;

            payurl = payurl + urlParams;
            
            invoice = {
                "invno"     : reminders[i].DOCNO, 
                "custname"  : reminders[i].CUSTOMER, 
                "invdate"   : reminders[i].DOCDT, 
                "company"   : reminders[i].CMPNNM, 
                "compmail"  : reminders[i].COMPMAIL, 
                "cmsg"      : reminders[i].CMESSAGE, 
                "url"       : payurl,
                "duedate"   : reminders[i].DUEDT, 
                "totalAmt"  : reminders[i].DUEAMT
            };
            
            // Get the email template
            template = emailTemplateServices.invoiceTemplate(invoice);
            // Email options
            console.log('1')
            let a={}
            let bstr=await pdftempate.ProcessContract("Kedar Lachke","Process search investigation of spouse, Alec Fromberg.","500.00","50.00","0.5","","800.00")
            console.log(bstr)
            let pdfbuffer=pdf.create(bstr,pdftempate.config).toBuffer(async(error,buffer)=>{
                console.log('2')
                if(error){
                    return Promise.reject();
                }
                
                
                
                console.log(buffer)
                mailOptions = {
                    from : reminders[i].CFROMNAME +"<" + reminders[i].CFORM + ">",
                    to : reminders[i].CTO,
                    //to : invoiceInfo[0].CUSTMAIL,
                    cc : `Kedar Lachke <kedarlachke1@gmail.com>`,        
                    subject : reminders[i].CSUBJECT,
                    html : template,
                    attachments : [{'filename': 'attachment.pdf', 'content': buffer}]
                };
        
                // Send email
                info = await emailServices.sendEmails(mailOptions); 
                return Promise.resolve();
            })
            
            
            //console.log(info);  
            
        }

    } 
    catch (error) 
    {console.log('error')
        console.log(error);
        return error;    
    }
}





// Export functions
module.exports = {
    invoiceDetailsForReminder,
    RemindersCRUDOps
};

