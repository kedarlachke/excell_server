/**
 * @author 
 */


// Import section
import dbServices from '../services/dbServices';
import sysDateTime from '../services/dateTimeServices';
import {
    nextSeriesNumberQuery
} from '../common/sqlQueries';

// Get the next number in series
const getNextSeriesNumber = async (clnt, cmpn, stype) =>
{
    try 
    {
        let selectQuery = nextSeriesNumberQuery;
        let affectedRecords = 0;
        
        // Placeholders for prepared query
        let placeHolders = [
            (typeof clnt !== 'undefined' && clnt.trim())              ?   clnt.trim()          : '',
            (typeof cmpn !== 'undefined' && cmpn.trim())              ?   cmpn.trim()          : '',
            (typeof stype !== 'undefined' && stype.trim())            ?   stype.trim()         : ''
        ];
    
    
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;
        let nextNumber = result[0].CRNT;
        //console.log("Next Number : " + nextNumber);
        
        if(typeof nextNumber !== 'undefined' && nextNumber.trim().length !=0)
        {
            // Update the current number
            let updateStatement ;
            let updateStatements = [] ;
            let currentNumber = parseInt(nextNumber) + 1;

            // form the data json
            let dataJSON = {
                "CRNT" : currentNumber + "",
                "UDATE" : sysDateTime.sysdate_yyyymmdd(),
                "UTIME" : sysDateTime.systime_hh24mmss()
            }
        
            // form the data json
            let clauseJSON = {
                "CLNT"    :   clnt,
                "CMPN"    :   cmpn,
                "STYPE"	  :	  stype
            }

            // Get the update statement
            updateStatement = await dbServices.getUpdateStatement("TSERIES", dataJSON, clauseJSON);
            //console.log("updateStatement => ");  console.log(updateStatement);
            updateStatements.push(updateStatement);

            // Use db service to execute DML transactions
            affectedRecords = await dbServices.executeDMLTransactions(updateStatements);
        
            //console.log("result => ");  console.log(affectedRecords);

            if(affectedRecords == 1)
                return await nextNumber;                        
            else
                throw new Error("Error updating TSERIES for series " + stype);    
        }

    } 
    catch (error) 
    {
        throw error;    
    }

}



module.exports = {
    getNextSeriesNumber
}