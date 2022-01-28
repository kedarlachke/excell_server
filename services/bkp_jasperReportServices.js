// Import section
import jaspernode from 'jaspernode';
import path from 'path';
import fs from 'fs';


// Resolver function for downloadReport(input):String
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

        /* const inputFile = "reports/ExellInvPrgRptInvoicesubreport.jasper";
        const outputFile = "reports/report"; */
        
        // jasper parameters
        parameters = JSON.parse(parameters);
        /* parameters = {
            "CLNT" : "1002",
            "LANG" : "EN",
            "DOCID": ""
        }; */

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


// Export functions
module.exports = {
    downloadReport
};