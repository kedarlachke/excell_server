/**
 * @author 
 */

// Jasper Report Type
// const typeDefs = `

//     # Query Type
//     type Query
//     {
//         # Download Jasper in PDF format
//         downloadReport
//         (
//             ReportType			:	ReportTypes!,
//             ParamObj			:	String!,
//             ReportName			:	String!
//         )   :   String       
//     }

// `;

// // Export the typeDefs
// module.exports = typeDefs;


/**
 * @author 
 */

// Jasper Report Type
const typeDefs = `

    # Query Type
    type Query
    {
        # Download Jasper in PDF format
        downloadReport
        (
            ReportType			:	ReportTypes!,
            ParamObj			:	String!,
            ReportName			:	String!
        )   :   String       
    }

`;

// Export the typeDefs
module.exports = typeDefs;