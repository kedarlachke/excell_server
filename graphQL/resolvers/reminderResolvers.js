/**
 * @author 
 */

// Import Section
import remindersServices from "../../services/remindersServices";


// Resolvers
const resolvers = 
{
    Query:
    {        
         // Resolver for invoiceDetailsForReminder(input) : [Reminder]
         invoiceDetailsForReminder : remindersServices.invoiceDetailsForReminder
    },

    Mutation:
    {
        // Resolver for RemindersCRUDOps(input) : String
        RemindersCRUDOps : remindersServices.RemindersCRUDOps
        
    }
};



// Export the resolvers
module.exports = resolvers;