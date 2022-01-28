/**
 * @author 
 */

// Import Section
import tasksServices from "../../services/tasksServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchDashboardTasks(input) : [Tasks]
        searchDashboardTasks : tasksServices.searchDashboardTasks,

        // Resolver for searchTasks(input) : [Tasks]
        searchTasks : tasksServices.searchTasks,

        // Resolver for searchLoggedUserTasks(input) : [Tasks]
        searchLoggedUserTasks : tasksServices.searchLoggedUserTasks,

        // Resolver for taskDetails(input) : [Tasks]
        taskDetails : tasksServices.taskDetails

    },

    Mutation:
    {
        // Resolver for TasksCRUDOps(input) : String
        TasksCRUDOps : tasksServices.TasksCRUDOps
        
    }
};



// Export the resolvers
module.exports = resolvers;