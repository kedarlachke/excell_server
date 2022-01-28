// /**
//  * @author 
//  */

// // Import Section
// import jasperReportServices from "../../services/jasperReportServices";


// // Resolvers
// const resolvers = 
// {
//     Query: 
//     {
//         // Resolver for downloadReport(input) : String
//         downloadReport : jasperReportServices.downloadReport
//     }

// };



// // Export the resolvers
// module.exports = resolvers;


/**
 * @author 
 */

// Import Section
import jasperReportServices from "../../services/jasperReportServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for downloadReport(input) : String
        downloadReport : jasperReportServices.downloadReport
    }

};



// Export the resolvers
module.exports = resolvers;