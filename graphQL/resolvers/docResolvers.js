/**
 * @author 
 */

// Import Section
import docServices from "../../services/docServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
       // Resolver for documentDetails(input) : [UploadedDocuments]
       getDocDetail : docServices.getDocDetail

    },

    Mutation:
    {
        // Resolver for uploadDocuments(input) : String
        createDocument : docServices.createDocument,

        // Resolver for deleteDocuments(input) : String
        deleteDocument : docServices.deleteDocument,
    }
};



// Export the resolvers
module.exports = resolvers;