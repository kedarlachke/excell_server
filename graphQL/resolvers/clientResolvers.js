/**
 * @author 
 */

// Import Section
import clientServices from "../../services/clientServices";


// Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for clientDetails(input) : [Client]
        clientDetails : clientServices.clientDetails
    },

    Mutation:
    {
        // Resolver for ClientCRUDOps(input) : String
        ClientCRUDOps : clientServices.ClientCRUDOps
        
    }
};



// Export the resolvers
module.exports = resolvers;