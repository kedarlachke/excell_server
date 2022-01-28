/**
 * @author 
 */

// Import Section
import paymentAuthorizationServices from "../../services/paymentAuthorizationServices";

// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for eCheckAuthorizationDetails(input) : [eCheckAuthorization]
        eCheckAuthorizationDetails : paymentAuthorizationServices.eCheckAuthorizationDetails,

        // Resolver for CardAuthorizationDetails(input) : [CardAuthorization]
        CardAuthorizationDetails : paymentAuthorizationServices.CardAuthorizationDetails,

        // Resolver for CashAuthorizationDetails(input) : [CashAuthorization]
        CashAuthorizationDetails : paymentAuthorizationServices.CashAuthorizationDetails

    },

    Mutation:
    {
        // Resolver for eCheckAuthorizationCRUDOps(input) : String
        eCheckAuthorizationCRUDOps : paymentAuthorizationServices.eCheckAuthorizationCRUDOps,

        // Resolver for CardAuthorizationCRUDOps(input) : String
        CardAuthorizationCRUDOps : paymentAuthorizationServices.CardAuthorizationCRUDOps,

        // Resolver for CashAuthorizationCRUDOps(input) : String
        CashAuthorizationCRUDOps : paymentAuthorizationServices.CashAuthorizationCRUDOps

    }
};



// Export the resolvers
module.exports = resolvers;