/**
 * @author Kedar Lachke
 */

// Import Section
import ratecardServices from "../../services/ratecardServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchRatecards(input) : [Ratecard]
        searchRatecards : ratecardServices.searchRatecards,
        // Resolver for ratecardDetails(input) : [Ratecard]
        ratecardDetails : ratecardServices.RatecardsDetails
    },

    Mutation:
    {
        // Resolver for ContactsCRUDOps(input) : String
        RatecardsCRUDOps : ratecardServices.RatecardsCRUDOps               
    }
};



// Export the resolvers
module.exports = resolvers;