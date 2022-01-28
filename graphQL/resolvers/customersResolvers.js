/**
 * @author 
 */

// Import Section
import customersServices from "../../services/customersServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchCustomers(input) : [Customers]
        searchCustomers : customersServices.searchCustomers,

        // Resolver for contactDetails(input) : [Customers]
        customerDetails : customersServices.customerDetails       

    },

    Mutation:
    {
        // Resolver for CustomersCRUDOps(input) : String
        CustomersCRUDOps : customersServices.CustomersCRUDOps
        
    }
};



// Export the resolvers
module.exports = resolvers;