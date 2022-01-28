/**
 * @author 
 */

// Import Section
import progressReportServices from "../../services/progressReportServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchProgressReports(input) : [ProgressReport]
        searchProgressReports : progressReportServices.searchProgressReports,

        // Resolver for progressReportDetails(input) : [ProgressReport]
        progressReportDetails : progressReportServices.progressReportDetails

    },

    Mutation:
    {
        // Resolver for ProgressReportCRUDOps(input) : String
        ProgressReportCRUDOps : progressReportServices.ProgressReportCRUDOps,

        // Resolver for UpdateProgressAgainstInvoice(input) : String
        UpdateProgressAgainstInvoice : progressReportServices.UpdateProgressAgainstInvoice,
        
        // Resolver for ToggleProgressWorkBilling(input) : String
        ToggleProgressWorkBilling : progressReportServices.ToggleProgressWorkBilling
        
    }
};



// Export the resolvers
module.exports = resolvers;