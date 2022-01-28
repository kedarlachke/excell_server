/**
 * @author 
 */

// Tasks Type
const typeDefs = `

    # Output Type
    type Task
    {
        TASKID			:	String,
        CLNT			:	String,
        LANG			:	String,
        TASKFOR			:	String,
        TASKOWNER		:	String,
        SUBJECT			:	String,
        STARTDATE		:	String,
        DUEDATE			:	String,
        STATUSID		:	String,
        STATUS			:	String,
        PRIORITYID		:	String,
        PRIORITY		:	String,
        PERCNTCOMPL		:	String,
        REMINDERREQ		:	String,
        REMINDERDT		:	String,
        REMINDERTM		:	String,
        TASKDETAILS		:	String,
        CDATE			:	String,
        CTIME			:	String,
        CUSER			:	String,
        UDATE			:	String,
        UTIME			:	String,
        UUSER			:	String,
        DDATE			:	String,
        DTIME			:	String,
        DUSER			:	String,
        ISDEL			:	String,
        TASKOF		    :	String,
        TASKOFID		:	String
    }


    # Input Type
    input Tasks
    {
        TASKID			:	String,
        CLNT			:	String,
        LANG			:	String,
        TASKFOR			:	String,
        TASKOWNER		:	String,
        SUBJECT			:	String,
        STARTDATE		:	String,
        DUEDATE			:	String,
        STATUSID		:	String,
        STATUS			:	String,
        PRIORITYID		:	String,
        PRIORITY		:	String,
        PERCNTCOMPL		:	String,
        REMINDERREQ		:	String,
        REMINDERDT		:	String,
        REMINDERTM		:	String,
        TASKDETAILS		:	String,
        TASKOF		    :	String,
        TASKOFID		:	String
    }


    # Query Type
    type Query
    {
        # Search dashboard tasks
        searchDashboardTasks
        (
            CLNT    :   String!,
            LANG    :   String!
        ) : [Task]   

        # Search tasks based on criteria
        searchTasks
        (
            CLNT    :   String!,
            LANG    :   String!,
            CUSER   :   String,
            STATUS  :   String,
            SUBJECT :   String,
            TASKFOR     :   String,
            PRIORITYID  :   String,
            FROMDATE    :   String,
            TODATE      :   String,
            TASKOF      :   String,
            TASKOFID    :   String,
            isAdmin :   Boolean = false
        ) : [Task]   

        # Search logged user's tasks based on criteria
        searchLoggedUserTasks
        (
            CLNT    :   String!,
            LANG    :   String!,
            TASKFOR :   String!,
            STATUS  :   String,
            SUBJECT :   String,
            TASKOWNER   :   String,
            PRIORITYID  :   String,
            FROMDATE    :   String,
            TODATE      :   String,
            TASKOF      :   String,
            TASKOFID    :   String,
            isDashboard :   Boolean = false
        ) : [Task]   

        # Get task details based on criteria
        taskDetails(
            CLNT        : String!, 
            LANG        : String!,
            TASKID      : String!
        ) : [Task]

    }


    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Tasks
        TasksCRUDOps
        (
            tasks       : [Tasks!]!,
            transaction : TransactionTypes!
        )   :   String       
    }

`;

// Export the typeDefs
module.exports = typeDefs;