/**
 * @author 
 */

// Import Section
import leadsServices from "../../services/leadsServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchLeads(input) : [Lead]
        searchLeads : leadsServices.searchLeads,

        // Resolver for searchDashboardLeads(input) : [Lead]
        searchDashboardLeads : leadsServices.searchDashboardLeads,

        // Resolver for leadDetails(input) : Lead
        leadDetails : leadsServices.leadDetails,

        searchMailsList : leadsServices.searchLeadsMails
    },

    Mutation:
    {
        // Resolver for LeadsCRUDOps(input) : String
        LeadsCRUDOps : leadsServices.LeadsCRUDOps,

        // Resolver for UpdateLeadStatus(input) : String
        UpdateLeadStatus : leadsServices.UpdateLeadStatus

    }
};



// Export the resolvers
module.exports = resolvers;