/**
 * @author Kedar Lachke
 */


// Import Section
import SignaturesServices from "../../services/SignaturesServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchESignatures(input) : [ESignatures]
        searchESignatures : SignaturesServices.searchESignature
               
    },

    Mutation:
    {
        // Resolver for ESignatureCRUDOps(input) : String
        ESignatureCRUDOps : SignaturesServices.ESignaturesCRUDOps               
    }
};



// Export the resolvers
module.exports = resolvers;