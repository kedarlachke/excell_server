/**
 * @author 
 */

//Import the date format module
//import dateFormat from 'dateformat';
import moment from 'moment';


// Get sysdate [yyyymmdd]
let sysdate_yyyymmdd = () => 
{
    // Get current timestamp
    //let now = new Date();
    //return dateFormat(now,'yyyymmdd');

    // Get current timestamp
    let now = moment();
    //console.log(now.format("YYYYMMDD"));

    return now.format("YYYYMMDD");
    

}

// Get systime [HHMMss]
let systime_hh24mmss = () => 
{
    // Get current timestamp
    //let now = new Date();
    //return dateFormat(now,'HHMMss');

    // Get current timestamp
    let now = moment();
    //console.log(now.format("HHmmss"));

    return now.format("HHmmss");
}

// Check date
let checkDate = (dateString, format) =>
{
    try 
    {        
        //let dateObj = moment("20181501", "YYYYMMDD").isValid();
        let isValidDate = moment(dateString, format).isValid();

        if(isValidDate) return true;
        else return false;
    } 
    catch (error) 
    {
        throw error;
    }
}

// Export
module.exports = {
    sysdate_yyyymmdd,
    systime_hh24mmss,
    checkDate
};