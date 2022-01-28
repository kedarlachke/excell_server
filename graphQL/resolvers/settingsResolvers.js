/**
 * @author 
 */

// Import Section
import settingsServices from "../../services/settingsServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchServices(input) : [Service]
        searchServices : settingsServices.searchServices,
        
        // Resolver for serviceDetails(input) : [Service]
        serviceDetails : settingsServices.serviceDetails
    },

    Mutation:
    {
        // Resolver for ServicesCRUDOps(input) : String
        ServicesCRUDOps : settingsServices.ServicesCRUDOps
        
    }
};



// Export the resolvers
module.exports = resolvers;