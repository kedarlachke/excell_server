/**
 * @author 
 */

// Import section
import nodemailer from 'nodemailer';
import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import emailTemplateServices from '../services/emailTemplateServices';

// Logged in user
var loginUser = {CLNT:"1002",LANG:"EN",USERNAME:"Sohan Patil",USERID:"SP0001",AUTH:{GRPID:"EXUSRS",GRPNM:"EMPLOYEE GROUP",}};


/**
 * Create transporter object
 * SMTP or other configurations 
 */
// const transporter = nodemailer.createTransport({
//     service : 'gmail',                      // email service
//     auth : {
//         user : 'itss.softwares',            // email id
//         pass : 'iTss.softwares@2013'        // password
//     }    
// });

//
//
const transporter = nodemailer.createTransport({
    service : 'Godaddy',
    host:"smtpout.secureserver.net", 
    secureConnection: true,
    port: 465,                     // email service
    auth : {
        user : 'support@excellinvestigation.com',            // email id
        pass : 'Palestine1'        // password
    }    
});




/**
 * Function to send emails
 * @param {} mailOptions    email options object, containing info like sender's address, subject, etc. 
 */
const sendEmails = async (mailOptions) => 
{
    
    try 
    {
        // Send email using nodemailer sendMail() function
        //console.log(JSON.stringify(mailOptions))
        
        let info = await transporter.sendMail(mailOptions);    
    
        // return response
        console.log(info)
        return info;
    } 
    catch (error) 
    {
        // if error occurs, return error
        console.log(error)
        throw error;        
    }
}


// Resolver function for mutation SendEmails(input):String
const SendEmails = async (args, context, info) =>
{
    try 
    {          
        let affectedRecords = 0;
        let UserName = args.emails[0].MAILLOGID;
        // Validate input data
        let emails = await validateEmailData(args.emails);

        // if all goes well, then create records
        affectedRecords = await createEmails(emails);
        args.emails[0].MAILLOGID=UserName
        // if all goes well, then create records
        
        for(var i=0;i<emails.length;i++){
           
        //    let mailMessage =  `<br>`+emails[i].MSGBODY+` 
        //     <br><br><b>Thank you</b>
        //     <br><b>Support Team</b>
        //     <br><b>Excell Investigations</b>
        //     <br><b>www.excellinvestigations.net</b>
        // `;
           

        let mailMessage =  "Dear  "+emails[i].MAILLOGID+","+`<br>`+emails[i].MSGBODY+`<br/>
        <br/>
        <br/>
        If you have any questions, please call us directly at 1.888.666.0089   
        <br/>
        <br/>
        We will be more than happy to assist you.
        
        <br/>
        <br/>
        <br/>
        <div ><br><b>Thank you</b>
         <br><b>Support Team</b>
         <br><b>Excell Investigations</b>
         <br><b>www.excellinvestigations.net</b></div>
     `;
           
           
            emails[i].MSGBODY=mailMessage;
        }
        
        await sendEmail(emails);

        return affectedRecords;        

    } 
    catch (error) 
    {
        console.log(error);
        
        return error;    
    }

}

// Validation funtion for creation
const validateEmailData = async (emails) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < emails.length; i++)
        {
            let validationObject = {};

            validations.checkNull("CLNT", emails[i].CLNT, "Client is required", validationObject);
            validations.checkNull("LANG", emails[i].LANG, "Language is required", validationObject);
            validations.checkNull("FROMID", emails[i].FROMID, "From is required", validationObject);
            validations.checkNull("TOID", emails[i].TOID, "To is required", validationObject);
            validations.checkNull("MSGBODY", emails[i].MSGBODY, "Message is required", validationObject);
            validations.checkNull("MAILSUB", emails[i].MAILSUB, "Subject is required", validationObject);

            validations.checkMaxLength("FROMID", emails[i].FROMID, 128, "Length of From should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("TOID", emails[i].TOID, 128, "Length of To should be less than or equal to 128 characters", validationObject);            

            emails[i].TOID.split(",").forEach(element => {
                validations.checkEmail("TOID", element.trim(), "Email id(s) are not valid", validationObject);    
            });

            emails[i].MAILCC.split(",").forEach(element => {
                validations.checkEmail("MAILCC", element.trim(), "Email id(s) are not valid", validationObject);    
            });

            emails[i].MAILBCC.split(",").forEach(element => {
                validations.checkEmail("MAILBCC", element.trim(), "Email id(s) are not valid", validationObject);    
            });

            //validations.checkEmail("TOID", emails[i].TOID, "Email id is not valid", validationObject);
            //validations.checkEmail("MAILCC", emails[i].MAILCC, "Email id is not valid", validationObject);
            //validations.checkEmail("MAILBCC", emails[i].MAILBCC, "Email id is not valid", validationObject);

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
            
            for(let i = 0; i < emails.length; i++)
            {
                // Get auto-generated number for emails id
                nextNumber = await numberSeries.getNextSeriesNumber(emails[i].CLNT, "NA", "MAILLO");
                
                // Add auto-generated number as emails id
                emails[i].MAILLOGID = nextNumber;

                // Add create params 
                emails[i].CDATE = curDate;
                emails[i].CTIME = curTime;
                emails[i].ISDEL = "N";
                emails[i].CUSER = loginUser.USERID.toLowerCase();
        
            }
        
            return emails;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// function for creating emails records
const createEmails = async (emails) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < emails.length; i++)
        {
            // form the data json
            dataJSON = emails[i];

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("MAILLOGS", dataJSON);
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


// function for sending emails after email creation
const sendEmail = async (emails) =>
{
    try 
    {   
        let mailMessage, template, mailOptions, info;

        for(let i = 0; i < emails.length; i++)
        {
            
            mailMessage =  emails[i].MSGBODY;
            console.log(mailMessage)
            template = emailTemplateServices.emailTemplate(mailMessage);

            mailOptions = {
                from : emails[i].FROMID,
                to : emails[i].TOID,
                cc : emails[i].MAILCC,  
                bcc : emails[i].MAILBCC,      
                subject : emails[i].MAILSUB,
                html : template,
                attachments : []
            };
    
    
            info = await sendEmails(mailOptions); 
            //console.log(info);  
    
        }

    } 
    catch (error) 
    {
        throw error;    
    }
}


// Export the function module
module.exports = {
    sendEmails,
    SendEmails
};