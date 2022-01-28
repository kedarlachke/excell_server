require('dotenv').config()

// Import section
import jaspernode from 'jaspernode';
import path from 'path';
import fs from 'fs';

import { getInvoiceReportData,getProgressReportData } from "./billingsServices";

/* // Resolver function for downloadReport(input):String
const downloadReport = async (args, context, info) =>
{

    try 
    {        
        let reportType = args.ReportType;
        let parameters = args.ParamObj;
        let outputFileName = args.ReportName;

        let jasperFile;
        reportType = reportType.trim().toUpperCase();        

        switch (reportType) {
            case 'INVOICE':
                jasperFile = 'ExellInvPrgRptInvoice';
                break;

            case 'PROGRESS_REPORT':
                jasperFile = 'ProgressReportNewExcellInv';
                break;

            default:
                throw new Error("Invalid report type specified.");
                break;
        }

        const inputFile = path.join(__dirname, '../reports/'+jasperFile+'.jasper')
        const outputFile = path.join(__dirname, '../reports/report') 

        
        // jasper parameters
        parameters = JSON.parse(parameters);
        

        // database configuration
        const dbConfig = {
            driver: 'mysql',
            host : "localhost",
            username : "it_qa",
            password : "it_qa",
            database : "excelprod"
        };

        // initialize
        let jasper = new jaspernode();

        // process the report
        let pathToFile = await jasper.process(inputFile, outputFile, parameters, dbConfig).execute();
        
        console.log("Report Generated.");

        context.response.setHeader("Content-disposition", "attachment; filename="+outputFileName+".pdf");
        context.response.setHeader("Content-type", "application/pdf");
        //console.log(path.join(__dirname, '../reports/report')+".pdf");

        let filecontents = fs.readFileSync(path.join(__dirname, '../reports/report')+".pdf");

        context.response.send(filecontents);

    } 
    catch (error) 
    {
        console.log("Jasper Error : ");
        console.log(error);

        return error;
    }
}
 */



// Resolver function for downloadReport(input):String
const downloadReport = async (args, context, info) =>
{

    try 
    {        

        console.log('abc123')
        const client = require('jsreport-client')(process.env.JSREPORTURL);

        let reportType = args.ReportType;
        let outputFileName = args.ReportName;

        let reportData, templateID = "";
        reportType = reportType.trim().toUpperCase();        

        switch (reportType) {
            case 'INVOICE':
                templateID = "ByRB5EIOm";
                reportData = await getInvoiceReportData(args);
                console.log(reportData);
                
                break;

            // case 'PROGRESS_REPORT':
            //     reportData = 'ProgressReportNewExcellInv';
            //     break;


            case 'PROGRESS_REPORT':
            templateID = "BJl-pN8OQ";
                reportData =  await getProgressReportData(args);
            break;


            default:
                throw new Error("Invalid report type specified.");
                break;
        }

        
        //--------- Execute JSReport Start ------------
        console.log(reportData);
        
        const genReport = await client.render({
            template: {"shortid" : templateID },
            data: reportData
        });
        
        const bodyBuffer = await genReport.body();

        console.log("Report Generated.");
        
        //--------- Execute JSReport Ends------------

        context.response.setHeader("Content-disposition", "attachment; filename="+outputFileName+".pdf");
        context.response.setHeader("Content-type", "application/pdf");

        context.response.send(bodyBuffer);

    } 
    catch (error) 
    {
        console.log("Jasper Error : ");
        console.log(error);

        return error;
    }
}


 // Export functions
module.exports = {
    downloadReport
};