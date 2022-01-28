/**
 * @author 
 */

// Import Section
import documentsServices from "../../services/documentsServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchCompanyDocuments(input) : [CompanyDocuments]
        searchCompanyDocuments : documentsServices.searchCompanyDocuments,

        // Resolver for searchUploadedDocuments(input) : [UploadedDocuments]
        searchUploadedDocuments : documentsServices.searchUploadedDocuments,

        // Resolver for documentDetails(input) : [UploadedDocuments]
        documentDetails : documentsServices.documentDetails

    },

    Mutation:
    {
        // Resolver for uploadDocuments(input) : String
        uploadDocuments : documentsServices.uploadDocuments,

        // Resolver for editDocuments(input) : String
        editDocuments : documentsServices.editDocuments,

        // Resolver for deleteDocuments(input) : String
        deleteDocuments : documentsServices.deleteDocuments,
        
        // Resolver for uploadCompanyDocuments(input) : String
        uploadCompanyDocuments : documentsServices.uploadCompanyDocuments,

        // Resolver for deleteCompanyDocuments(input) : String
        deleteCompanyDocuments : documentsServices.deleteCompanyDocuments

    }
};



// Export the resolvers
module.exports = resolvers;