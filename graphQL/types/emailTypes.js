/**
 * @author 
 */

// Email Type
const typeDefs = `

    # Input Type
    input Emails
    {
        CLNT		:	String,
        LANG		:	String,
        MAILLOGID	:	String,
        FROMID		:	String,
        TOID		:	String,
        MSGBODY		:	String,
        MAILFOR		:	String,
        MAILFORID	:	String,
        MAILSUB		:	String,
        MAILCC		:	String,
        MAILBCC		:	String
    }


    # Mutation Type
    type Mutation
    {
        # Email Operations
        SendEmails
        (
            emails      : [Emails!]!,
        )   :   String       
    }

`;

// Export the typeDefs
module.exports = typeDefs;