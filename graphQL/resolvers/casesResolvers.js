/**
 * @author 
 */

// Import Section
import casesServices from "../../services/casesServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchCases(input) : [Case]
        searchCases : casesServices.searchCases,

        // Resolver for caseDetails(input) : [Case]
        caseDetails : casesServices.caseDetails

    },

    Mutation:
    {
        // Resolver for CasesCRUDOps(input) : [String]
        CasesCRUDOps : casesServices.CasesCRUDOps,

        // Resolver for UpdateCaseStatus(input) : [String]
        UpdateCaseStatus : casesServices.UpdateCaseStatus

    }
};



// Export the resolvers
module.exports = resolvers;