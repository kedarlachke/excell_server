/**
 * @author 
 */

// Import Section
import contractsServices from "../../services/contractsServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for contractDetails(input) : [Contracts]
        contractDetails : contractsServices.contractDetails,

        // Resolver for contractDetails(input) : [Contracts]
        contractTemplate : contractsServices.contractTemplate       
        
    },

    Mutation:
    {
        // Resolver for ContractsCRUDOps(input) : String
        ContractsCRUDOps : contractsServices.ContractsCRUDOps  ,
        MailContract :   contractsServices.MailContract          
    }
};



// Export the resolvers
module.exports = resolvers;