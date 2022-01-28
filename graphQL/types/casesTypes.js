/**
 * @author 
 */

// Case Type
const typeDefs = 
`
    # Output Type
    type Case
    {
        CLNT                : String,
        LANG                : String,
        CLNTID              : String,
        FIRSTNM             : String,
        LASTNM              : String,
        FRSTNM              : String,
        CIDSYS              : String,
        CID                 : String,
        CASETL              : String,
        FILENO              : String,
        TYPE                : String,
        CASEDT              : String,
        COURTNM             : String,
        DEPT                : String,
        OFFICENM            : String,
        CITY                : String,
        STDESC              : String,
        EMAILID             : String,
        PHONE               : String,
        ADDRESS             : String,
        TDESC               : String,
        MODDESC             : String,
        ISCLOSED            : String,
        ASSIGNUSER          : String,
        SERVICETYP          : String,
        STATUS              : String,
        PRGRPTTXT           : String,
        UDATE	            : String,

        CLIENTID: String,
        LTDTTOSERV: String,
        HEARINGSETFOR: String,
        AT: String,
        MISCELIST: String,
        LSTNM: String,
        SPOUSE: String,
        SEX: String,
        RACE: String,
        AGE: String,
        HEIGHT: String,
        WEIGHT: String,
        HAIRCOLOR: String,
        RESADDRESS: String,
        BUSADDRESS: String,
        BTTMTOSERV: String,
        HOURSOFWK: String,
        PLMKATTPAT: String,
        PRIORITY: String,
        CDATE: String,
        CTIME: String,
        CUSER: String,
        UTIME: String,
        UUSER: String,
        ISDEL: String,
        DDATE: String,
        DTIME: String,
        DUSER: String,
        SURSTARTDT: String,
        SURENDDT: String,
        ISGPSNEEDED: String,
        ACTIONDETAILS: String,
        DAYSFORSUR: String,
        ISIFTWOINVESTIGATORS: String,
        ISPREVIOUSSUR: String,
        ISBEYONDTMACTIVE: String,
        BUDGET: String,
        HEARABOUTUS: String,
        LICENSEPLATE: String,
        CMAKE: String,
        CMODEL: String,
        CDESCRIPTION: String,
        ADJFIRSTNM: String,
        ADJLASTNM: String,
        EMAIL: String,
        ADJADDRESS: String,
        STATE: String,
        ZIPCD: String,
        CLAIM: String,
        ISSUBREPRESENT: String,
        SUBINJURYCLAIM: String,
        EXPCUSTSITUATION: String,
        EXPNEGSUBINVOLVE: String,
        AKA: String,
        DOB: String,
        BUSINESSNM: String,
        BUSINESSTYP: String,
        BUSINESSTXID: String,
        PHONE2: String,
        CITY2: String,
        STATE2: String,
        ZIPCD2: String,
        EMPID: String,
        EMPPHONE: String,
        EMPCITY: String,
        EMPSTATE: String,
        EMPZIPCD: String,
        SECURITYSUB: String,
        SECURITYSPOS: String,
        DRIVERLINCSUB: String,
        DRIVERLINCSPOS: String,
        ACCOUNTS: String,
        CARBOTVS: String,
        SRCOFINCM: String,
        LANDPRPTY: String,
        HIDDENASST: String,
        BUSSORCORP: String,
        OTHER: String,
        OTHERINFO: String,
        CRTJDGMT: String,
        HELPRCVRY: String,
        LSTPERSON: String,
        FRQTLOCATION: String,
        HOOBBIES: String,
        POTLADDRESS: String,
        STATUSDT: String,
        STATUSTM: String,
        SUBJECT: String,
        DESCRIPTION: String,
        CASERATE: String,
        ABOUTBUSINESS   : String,
        SUBJECT_FREQUENTS:String,
        OVERALL_OBJ     : String,
        DEADLINE        : String,
        SERVICES        : String,
        MAILCOUNT       : String,
        TASKCOUNT       : String,
        LEADNOTECOUNT   : String,
        ADDCOMMETS      : String
        }

    # Input type
    input Cases
    {
        CLNT	        : String,
        LANG	        : String,
        CLIENTID	    : String,
        CID	            : String,
        CASEDT	        : String,
        COURTNM	        : String,
        CASETL	        : String,
        FILENO	        : String,
        LTDTTOSERV	    : String,
        TYPE	        : String,
        HEARINGSETFOR	: String,
        AT	            : String,
        DEPT	        : String,
        MISCELIST	    : String,
        FRSTNM	        : String,
        LSTNM	        : String,
        SPOUSE	        : String,
        SEX	            : String,
        RACE	        : String,
        AGE	            : String,
        HEIGHT	        : String,
        WEIGHT	        : String,
        HAIRCOLOR	    : String,
        RESADDRESS	    : String,
        BUSADDRESS	    : String,
        BTTMTOSERV	    : String,
        HOURSOFWK	    : String,
        PLMKATTPAT	    : String,
        PRIORITY	    : String,
        CDATE	        : String,
        CTIME	        : String,
        CUSER	        : String,
        UDATE	        : String,
        UTIME	        : String,
        UUSER	        : String,
        ISDEL	        : String,
        DDATE	        : String,
        DTIME	        : String,
        DUSER	        : String,
        CIDSYS	        : String,
        ASSIGNUSER	    : String,
        ISCLOSED	    : String,
        SURSTARTDT	    : String,
        SURENDDT	    : String,
        ISGPSNEEDED	    : String,
        ACTIONDETAILS	: String,
        DAYSFORSUR	    : String,
        ISIFTWOINVESTIGATORS	: String,
        ISPREVIOUSSUR	        : String,
        ISBEYONDTMACTIVE	    : String,
        BUDGET	        : String,
        HEARABOUTUS	    : String,
        LICENSEPLATE	: String,
        CMAKE	        : String,
        CMODEL	        : String,
        CDESCRIPTION	: String,
        ADJFIRSTNM	    : String,
        ADJLASTNM	    : String,
        PHONE	        : String,
        EMAIL	        : String,
        ADJADDRESS	    : String,
        CITY	        : String,
        STATE	        : String,
        ZIPCD	        : String,
        CLAIM	        : String,
        ISSUBREPRESENT	: String,
        SUBINJURYCLAIM	: String,
        EXPCUSTSITUATION	: String,
        EXPNEGSUBINVOLVE	: String,
        AKA	            : String,
        DOB	            : String,
        BUSINESSNM	    : String,
        BUSINESSTYP	    : String,
        BUSINESSTXID	: String,
        PHONE2	        : String,
        CITY2	        : String,
        STATE2	        : String,
        ZIPCD2	        : String,
        EMPID	        : String,
        EMPPHONE	    : String,
        EMPCITY	        : String,
        EMPSTATE	    : String,
        EMPZIPCD	    : String,
        SECURITYSUB	    : String,
        SECURITYSPOS	: String,
        DRIVERLINCSUB	: String,
        DRIVERLINCSPOS	: String,
        ACCOUNTS	    : String,
        CARBOTVS	    : String,
        SRCOFINCM	    : String,
        LANDPRPTY	    : String,
        HIDDENASST	    : String,
        BUSSORCORP	    : String,
        OTHER	        : String,
        OTHERINFO	    : String,
        CRTJDGMT	    : String,
        HELPRCVRY	    : String,
        LSTPERSON	    : String,
        FRQTLOCATION	: String,
        HOOBBIES	    : String,
        POTLADDRESS	    : String,
        SERVICETYP	    : String,
        STATUSDT	    : String,
        STATUSTM	    : String,
        STATUS	        : String,
        PRGRPTTXT	    : String,
        SUBJECT	        : String,
        DESCRIPTION	    : String,
        ABOUTBUSINESS   : String,
        SUBJECT_FREQUENTS:String,
        OVERALL_OBJ     : String,
        DEADLINE        : String,
        SERVICES        : String
    }





    # Input type
    input CaseStatus
    {
        CLNT	        : String!,
        LANG	        : String!,
        CIDSYS	        : String!,
        STATUS	        : String,
        PRIORITY        : String,
        ASSIGNUSER      : String,
        CASERATE        : String,
    }



    # Query Type
    type Query
    {
        # Search cases based on criteria        OR
        # Search dashboard cases based on criteria
        searchCases
        (
            CLNT        : String!,  # Client 
            LANG        : String!,
            FIRSTNM     : String,
            LASTNM      : String, 
            EMAILID     : String, 
            PHONE       : String, 
            ASSIGNUSER  : String,
            isAdmin     : Boolean = false
        ) : [Case]

        # Get case details based on criteria
        caseDetails(
            CLNT        : String!, 
            LANG        : String!,
            CIDSYS      : String!
        ) : [Case]

    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Cases
        CasesCRUDOps
        (
            typeofCase  : CaseTypes!,
            cases       : [Cases!]!,
            transaction : TransactionTypes!
        )   :   [String]       

        # Update Case Status
        UpdateCaseStatus
        (
            casestatus  : [CaseStatus!]!
        )   :   [String]       

    }
`;    


// Export the typeDefs
module.exports = typeDefs;