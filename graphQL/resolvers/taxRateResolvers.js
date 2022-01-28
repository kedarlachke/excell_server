/**
 * @author 
 */

// Import Section
import taxRateServices from "../../services/taxRateServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchTaxRates(input) : [TaxRate]
        searchTaxRates : taxRateServices.searchTaxRates
    }
};



// Export the resolvers
module.exports = resolvers;