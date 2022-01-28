/**
 * @author 
 */

/**
 *  Section 1 : Queries for Search / Duplication Check / Details
 */

// Query for Searching Cases for Admin User     OR
// Query for Searching Dashboard Cases for Admin User
// export const searchAdminCasesQuery = `
//     SELECT
//         *
//     FROM
//         (
//         SELECT
//             CLD.CLNT,
//             CLD.LANG,
//             CLD.CLNTID,
//             CLD.FIRSTNM,
//             CLD.LASTNM,
//             CONCAT(CLD.FIRSTNM, " ", CLD.LASTNM) AS "FRSTNM",
//             CSD.CIDSYS,
//             CSD.CID,
//             CSD.CASETL,
//             CSD.FILENO,
//             CSD.TYPE,
//             CSD.CASEDT,
//             CSD.COURTNM,
//             CSD.DEPT,
//             CLD.OFFICENM,
//             CLD.CITY,
//             ST.STDESC,
//             CLD.EMAILID,
//             CLD.PHONE,
//             CLD.ADDRESS,
//             BT.TDESC,
//             MDC.MODDESC,
//             CSD.ISCLOSED,
//             CSD.ASSIGNUSER,
//             CSD.SERVICETYP,
//             CSD.STATUS,
//             CSD.PRGRPTTXT,
//             CASE WHEN CSD.UDATE IS NULL THEN CSD.CDATE 
//                 ELSE CSD.UDATE
//             END AS LSTUPDT,
//             CSD.PRIORITY
//     FROM
//         CLIENTDETAILS CLD
//     LEFT JOIN CASEDETAILS CSD ON
//         CLD.CLNTID = CSD.CLIENTID AND CLD.ISDEL = 'N' AND CSD.ISDEL = 'N' AND CSD.ISCLOSED = 'N'
//     LEFT JOIN STATENM ST ON
//         CLD.STATE = ST.STCODE
//     LEFT JOIN BESTTMCAL BT ON
//         CLD.BESTTMCAL = BT.TCODE
//     LEFT JOIN PREFMODCON MDC ON
//         CLD.MODOFCON = MDC.MODCODE
//     ORDER BY
//         CLD.FIRSTNM
//     ) AS T
//     WHERE
//         T.CLNT = ? 
//         AND T.LANG = ? 
//         AND UPPER(T.FIRSTNM) LIKE UPPER(?) 
//         AND UPPER(T.LASTNM) LIKE UPPER(?) 
//         AND UPPER(T.EMAILID) LIKE UPPER(?) 
//         AND UPPER(T.PHONE) LIKE UPPER(?)
//     ORDER BY
//         CONVERT(T.CIDSYS, UNSIGNED)	DESC
        
// `;


export const searchAdminCasesQuery = `
    SELECT
        *
    FROM
        (
        SELECT
            CLD.CLNT,
            CLD.LANG,
            CLD.CLNTID,
            CLD.FIRSTNM,
            CLD.LASTNM,
            CONCAT(CLD.FIRSTNM, " ", CLD.LASTNM) AS "FRSTNM",
            CSD.CIDSYS,
            CSD.CID,
            CSD.CASETL,
            CSD.FILENO,
            CSD.TYPE,
            CSD.CASEDT,
            CSD.COURTNM,
            CSD.DEPT,
            CLD.OFFICENM,
            CLD.CITY,
            ST.STDESC,
            CLD.EMAILID,
            CLD.PHONE,
            CLD.ADDRESS,
            BT.TDESC,
            MDC.MODDESC,
            CSD.ISCLOSED,
            CSD.ASSIGNUSER,
            CSD.SERVICETYP,
            (SELECT STATDSC FROM MJOBSTAT JOBST WHERE JOBST.STATCD=CSD.STATUS)STATUS,
            CSD.PRGRPTTXT,
            CASE WHEN CSD.UDATE IS NULL THEN CSD.CDATE 
                ELSE CSD.UDATE
            END AS LSTUPDT,
            CSD.PRIORITY
    FROM
        CLIENTDETAILS CLD
    LEFT JOIN CASEDETAILS CSD ON
        CLD.CLNTID = CSD.CLIENTID AND CLD.ISDEL = 'N' AND CSD.ISDEL = 'N' AND CSD.ISCLOSED = 'N'
    LEFT JOIN STATENM ST ON
        CLD.STATE = ST.STCODE
    LEFT JOIN BESTTMCAL BT ON
        CLD.BESTTMCAL = BT.TCODE
    LEFT JOIN PREFMODCON MDC ON
        CLD.MODOFCON = MDC.MODCODE
    ORDER BY
        CLD.FIRSTNM
    ) AS T
    WHERE
        T.CLNT = ? 
        AND T.LANG = ? 
        AND UPPER(T.FIRSTNM) LIKE UPPER(?) 
        AND UPPER(T.LASTNM) LIKE UPPER(?) 
        AND UPPER(T.EMAILID) LIKE UPPER(?) 
        AND UPPER(T.PHONE) LIKE UPPER(?)
        AND CIDSYS IS NOT NULL
    ORDER BY
        CONVERT(T.CIDSYS, UNSIGNED)	DESC
        
`;


// Query for Searching Cases for User other than Admin      OR
// Query for Searching Dashboard Cases for User other than Admin
// export const searchUserCasesQuery = `
//     SELECT
//         *
//     FROM
//         (
//         SELECT
//             CLD.CLNT,
//             CLD.LANG,
//             CLD.CLNTID,
//             CLD.FIRSTNM,
//             CLD.LASTNM,
//             CONCAT(CLD.FIRSTNM, " ", CLD.LASTNM) AS "FRSTNM",
//             CSD.CIDSYS,
//             CSD.CID,
//             CSD.CASETL,
//             CSD.FILENO,
//             CSD.TYPE,
//             CSD.CASEDT,
//             CSD.COURTNM,
//             CSD.DEPT,
//             CLD.OFFICENM,
//             CLD.CITY,
//             ST.STDESC,
//             CLD.EMAILID,
//             CLD.PHONE,
//             BT.TDESC,
//             MDC.MODDESC,
//             CSD.ISCLOSED,
//             CSD.ASSIGNUSER,
//             CSD.SERVICETYP,
//             CSD.STATUS,
//             CSD.PRGRPTTXT,
//             CASE WHEN CSD.UDATE IS NULL THEN CSD.CDATE ELSE CSD.UDATE
//             END AS LSTUPDT,
//             CSD.PRIORITY
//     FROM
//         CLIENTDETAILS CLD
//     LEFT JOIN CASEDETAILS CSD ON
//         CLD.CLNTID = CSD.CLIENTID AND CLD.ISDEL = 'N' AND CSD.ISDEL = 'N' AND CSD.ISCLOSED = 'N'
//     LEFT JOIN STATENM ST ON
//         CLD.STATE = ST.STCODE
//     LEFT JOIN BESTTMCAL BT ON
//         CLD.BESTTMCAL = BT.TCODE
//     LEFT JOIN PREFMODCON MDC ON
//         CLD.MODOFCON = MDC.MODCODE
//     ORDER BY
//         CLD.FIRSTNM
//     ) AS T
//     WHERE
//         T.CLNT = ? 
//         AND T.LANG = ? 
//         AND UPPER(T.FIRSTNM) LIKE UPPER(?) 
//         AND UPPER(T.LASTNM) LIKE UPPER(?) 
//         AND UPPER(T.EMAILID) LIKE UPPER(?) 
//         AND UPPER(T.PHONE) LIKE UPPER(?) 
//         AND UPPER(ASSIGNUSER) = UPPER(?)
//     ORDER BY
//         T.FIRSTNM,
//         T.LASTNM,
//         T.OFFICENM,
//         T.CASETL,
//         T.CLNTID
// `;



export const searchUserCasesQuery = `
    SELECT
        *
    FROM
        (
        SELECT
            CLD.CLNT,
            CLD.LANG,
            CLD.CLNTID,
            CLD.FIRSTNM,
            CLD.LASTNM,
            CONCAT(CLD.FIRSTNM, " ", CLD.LASTNM) AS "FRSTNM",
            CSD.CIDSYS,
            CSD.CID,
            CSD.CASETL,
            CSD.FILENO,
            CSD.TYPE,
            CSD.CASEDT,
            CSD.COURTNM,
            CSD.DEPT,
            CLD.OFFICENM,
            CLD.CITY,
            ST.STDESC,
            CLD.EMAILID,
            CLD.PHONE,
            BT.TDESC,
            MDC.MODDESC,
            CSD.ISCLOSED,
            CSD.ASSIGNUSER,
            CSD.SERVICETYP,
            (SELECT STATDSC FROM MJOBSTAT JOBST WHERE JOBST.STATCD=CSD.STATUS)STATUS,
            CSD.PRGRPTTXT,
            CASE WHEN CSD.UDATE IS NULL THEN CSD.CDATE ELSE CSD.UDATE
            END AS LSTUPDT,
            CSD.PRIORITY
    FROM
        CLIENTDETAILS CLD
    LEFT JOIN CASEDETAILS CSD ON
        CLD.CLNTID = CSD.CLIENTID AND CLD.ISDEL = 'N' AND CSD.ISDEL = 'N' AND CSD.ISCLOSED = 'N'
    LEFT JOIN STATENM ST ON
        CLD.STATE = ST.STCODE
    LEFT JOIN BESTTMCAL BT ON
        CLD.BESTTMCAL = BT.TCODE
    LEFT JOIN PREFMODCON MDC ON
        CLD.MODOFCON = MDC.MODCODE
    ORDER BY
        CLD.FIRSTNM
    ) AS T
    WHERE
        T.CLNT = ? 
        AND T.LANG = ? 
        AND UPPER(T.FIRSTNM) LIKE UPPER(?) 
        AND UPPER(T.LASTNM) LIKE UPPER(?) 
        AND UPPER(T.EMAILID) LIKE UPPER(?) 
        AND UPPER(T.PHONE) LIKE UPPER(?) 
        AND UPPER(ASSIGNUSER) = UPPER(?)
		AND CIDSYS IS NOT NULL
    ORDER BY
        T.FIRSTNM,
        T.LASTNM,
        T.OFFICENM,
        T.CASETL,
        T.CLNTID
`;


export const searchContactsByIdQuery = `
SELECT * FROM TCONTACTS TCONT WHERE TCONT.CLNT=? AND UPPER(TCONT.LANG) = UPPER(?) AND TCONT.CONTACTID = ?
`;

export const searchAdminLeadsQuery = `
    SELECT
        TINQ.LSTNM,
        B.TDESC AS BESTTMCAL,
        TINQ.FRSTNM,
        M.PRTDESC AS PRIORITY,
        TINQ.FULLNM,
        TINQ.EMAILID,
        TINQ.PHONE,
        TINQ.CID,
        TINQ.CDATE,
        TINQ.OFFICENM,
        TINQ.CSOURCE,
        U.USRNM ASSIGNTO,
        S.STDESC STDESC,
        J.STATDSC	STATUS,
        MODDESC,
        (select count(*) from maillogs where MAILFOR='Lead' and MAILFORID=TINQ.CID and ISDEL='N') MAILCOUNT,
        (select count(*) from t_tasks where TASKOF='Lead' and TASKOFID=TINQ.CID and ISDEL='N') TASKCOUNT,
		(select count(*) from TIMAGE where CENTITY='Lead' and CENTITYID=TINQ.CID and ISDEL='N') LEADNOTECOUNT,
        (
            SELECT
                SRCMODENM
            FROM
                SOURCEMODE
            WHERE
                SRCMODECD = TINQ.MODEOFSRC
        ) MODEOFSRC,
        (SELECT NOTE FROM TIMAGE WHERE CLNT = TINQ.CLNT AND LANG = TINQ.LANG AND CENTITYID = TINQ.CID AND ISDEL = 'N' ORDER BY CDATE, CTIME DESC LIMIT 1) ADDCOMMETS,
        CASE WHEN TINQ.UDATE IS NULL THEN TINQ.CDATE 
            ELSE TINQ.UDATE
        END AS LSTUPDT
    FROM
        EXLEADS TINQ
    LEFT OUTER JOIN TUSER U ON
        TINQ.ASSIGNTO = U.USRID AND TINQ.CLNT = U.CLNT
    LEFT OUTER JOIN SERVTYP S ON
        IFNULL(TINQ.TYPSERV,"00") = S.STCODE
    LEFT OUTER JOIN MJOBSTAT J ON
        TINQ.STATUS = J.STATCD
    LEFT OUTER JOIN PREFMODCON C ON
        TINQ.MODOFCON = C.MODCODE
    LEFT OUTER JOIN MPRIORITY M ON
        TINQ.PRIORITY = M.PRTCD AND TINQ.CLNT = M.CLNT
    LEFT OUTER JOIN BESTTMCAL B ON
        TINQ.BESTTMCAL = B.TCODE AND TINQ.CLNT = B.CLNT
    LEFT OUTER JOIN servcat SC ON
        IFNULL(TINQ.CATCODE,"00") = SC.CATCODE AND TINQ.CLNT = SC.CLNT
    WHERE
        TINQ.CLNT = ? 
        AND TINQ.LANG = ? 
        AND
        (
            UPPER(COALESCE(TINQ.FULLNM, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.OFFICENM, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.PHONE, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.EMAILID, 'X')) LIKE UPPER(?) 
            AND UPPER(IFNULL(TINQ.TYPSERV, '00')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.STATUS, 'X')) LIKE UPPER(?)
            AND UPPER(IFNULL(TINQ.CATCODE, '00')) LIKE UPPER(?)
        ) 
        AND TINQ.ISDEL = 'N'
        AND S.ISDEL = 'N'
    ORDER BY
        CONVERT(TINQ.CID, UNSIGNED)	DESC
        
`;




export const searchUserLeadsQuery = `
    SELECT
        TINQ.LSTNM,
        B.TDESC AS BESTTMCAL,
        TINQ.FRSTNM,
        M.PRTDESC AS PRIORITY,
        TINQ.FULLNM,
        TINQ.EMAILID,
        TINQ.PHONE,
        TINQ.CID,
        TINQ.CDATE,
        TINQ.OFFICENM,
        TINQ.CSOURCE,
        U.USRNM ASSIGNTO,
        S.STDESC STDESC,
        J.STATDSC	STATUS,
        MODDESC,
        (select count(*) from maillogs where MAILFOR='Lead' and MAILFORID=TINQ.CID and ISDEL='N') MailCount,
        (select count(*) from t_tasks where TASKOF='Lead' and TASKOFID=TINQ.CID and ISDEL='N') TaskCount,
        (select count(*) from TIMAGE where CENTITY='Lead' and CENTITYID=TINQ.CID and ISDEL='N') LEADNOTECOUNT,
		(
            SELECT
                SRCMODENM
            FROM
                SOURCEMODE
            WHERE
                SRCMODECD = TINQ.MODEOFSRC
        ) MODEOFSRC,
        (SELECT NOTE FROM TIMAGE WHERE CLNT = TINQ.CLNT AND LANG = TINQ.LANG AND CENTITYID = TINQ.CID AND ISDEL = 'N' ORDER BY CDATE, CTIME DESC LIMIT 1) ADDCOMMETS, 
        CASE WHEN TINQ.UDATE IS NULL THEN TINQ.CDATE 
            ELSE TINQ.UDATE
        END AS LSTUPDT
    FROM
    EXLEADS TINQ
    LEFT OUTER JOIN TUSER U ON
    TINQ.ASSIGNTO = U.USRID AND TINQ.CLNT = U.CLNT
    LEFT OUTER JOIN SERVTYP S ON
    IFNULL(TINQ.TYPSERV,"00") = S.STCODE
    LEFT OUTER JOIN MJOBSTAT J ON
    TINQ.STATUS = J.STATCD
    LEFT OUTER JOIN PREFMODCON C ON
    TINQ.MODOFCON = C.MODCODE
    LEFT OUTER JOIN MPRIORITY M ON
    TINQ.PRIORITY = M.PRTCD AND TINQ.CLNT = M.CLNT
    LEFT OUTER JOIN BESTTMCAL B ON
    TINQ.BESTTMCAL = B.TCODE AND TINQ.CLNT = B.CLNT
    LEFT OUTER JOIN servcat SC ON
    IFNULL(TINQ.CATCODE,"00") = SC.CATCODE AND TINQ.CLNT = SC.CLNT
    WHERE
    TINQ.CLNT = ? 
    AND TINQ.LANG = ? 
    AND
    (
        UPPER(COALESCE(TINQ.FULLNM, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.OFFICENM, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.PHONE, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.EMAILID, 'X')) LIKE UPPER(?) 
        AND UPPER(IFNULL(TINQ.TYPSERV, '00')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.STATUS, 'X')) LIKE UPPER(?) 
        AND UPPER(IFNULL(TINQ.CATCODE, '00')) LIKE UPPER(?)
        AND UPPER(ASSIGNTO) = UPPER(?)
    ) 
    AND TINQ.ISDEL = 'N'
    ORDER BY
    CONVERT(TINQ.CID, UNSIGNED)	DESC
`;

// Query for Searching leads for Admin User
export const searchAdminLeadsQuery_20190821 = `
    SELECT
        TINQ.LSTNM,
        B.TDESC AS BESTTMCAL,
        TINQ.FRSTNM,
        M.PRTDESC AS PRIORITY,
        TINQ.FULLNM,
        TINQ.EMAILID,
        TINQ.PHONE,
        TINQ.CID,
        TINQ.CDATE,
        TINQ.OFFICENM,
        TINQ.CSOURCE,
        U.USRNM ASSIGNTO,
        S.STDESC STDESC,
        J.STATDSC	STATUS,
        (select count(*) from maillogs where MAILFOR='Lead' and MAILFORID=TINQ.CID) MAILCOUNT,
        (select count(*) from t_tasks where TASKOF='Lead' and TASKOFID=TINQ.CID) TASKCOUNT,

        MODDESC,
        (
            SELECT
                SRCMODENM
            FROM
                SOURCEMODE
            WHERE
                SRCMODECD = TINQ.MODEOFSRC
        ) MODEOFSRC,
        TINQ.LEADNOTES ADDCOMMETS,
        CASE WHEN TINQ.UDATE IS NULL THEN TINQ.CDATE 
            ELSE TINQ.UDATE
        END AS LSTUPDT
    FROM
        EXLEADS TINQ
    LEFT OUTER JOIN TUSER U ON
        TINQ.ASSIGNTO = U.USRID AND TINQ.CLNT = U.CLNT
    LEFT OUTER JOIN SERVTYP S ON
        TINQ.TYPSERV = S.STCODE
    LEFT OUTER JOIN MJOBSTAT J ON
        TINQ.STATUS = J.STATCD
    LEFT OUTER JOIN PREFMODCON C ON
        TINQ.MODOFCON = C.MODCODE
    LEFT OUTER JOIN MPRIORITY M ON
        TINQ.PRIORITY = M.PRTCD AND TINQ.CLNT = M.CLNT
    LEFT OUTER JOIN BESTTMCAL B ON
        TINQ.BESTTMCAL = B.TCODE AND TINQ.CLNT = B.CLNT
    LEFT OUTER JOIN servcat SC ON
        TINQ.CATCODE = SC.CATCODE AND TINQ.CLNT = SC.CLNT
    WHERE
        TINQ.CLNT = ? 
        AND TINQ.LANG = ? 
        AND
        (
            UPPER(COALESCE(TINQ.FULLNM, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.OFFICENM, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.PHONE, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.EMAILID, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.TYPSERV, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.STATUS, 'X')) LIKE UPPER(?)
            AND UPPER(COALESCE(TINQ.CATCODE, 'X')) LIKE UPPER(?)
        ) 
        AND TINQ.ISDEL = 'N'
        AND S.ISDEL = 'N'
    ORDER BY
        CONVERT(TINQ.CID, UNSIGNED)	DESC
        
`;


// Query for Searching leads for User other than Admin
export const searchUserLeadsQuery_20190821 = `
    SELECT
        TINQ.LSTNM,
        B.TDESC AS BESTTMCAL,
        TINQ.FRSTNM,
        M.PRTDESC AS PRIORITY,
        TINQ.FULLNM,
        TINQ.EMAILID,
        TINQ.PHONE,
        TINQ.CID,
        TINQ.CDATE,
        TINQ.OFFICENM,
        TINQ.CSOURCE,
        U.USRNM ASSIGNTO,
        S.STDESC STDESC,
        J.STATDSC	STATUS,
        MODDESC,
        (
            SELECT
                SRCMODENM
            FROM
                SOURCEMODE
            WHERE
                SRCMODECD = TINQ.MODEOFSRC
        ) MODEOFSRC,
        (select count(*) from maillogs where MAILFOR='Lead' and MAILFORID=TINQ.CID) MAILCOUNT,
        (select count(*) from t_tasks where TASKOF='Lead' and TASKOFID=TINQ.CID) TASKCOUNT,
        (
            SELECT
                NOTE
            FROM
                TIMAGE
            WHERE
                CLNT = TINQ.CLNT AND LANG = TINQ.LANG AND CENTITYID = TINQ.CID AND ISDEL = 'N'
            ORDER BY
                CDATE,
                CTIME
            DESC
            LIMIT 1
        ) ADDCOMMETS, 
        CASE WHEN TINQ.UDATE IS NULL THEN TINQ.CDATE 
            ELSE TINQ.UDATE
        END AS LSTUPDT
    FROM
    EXLEADS TINQ
    LEFT OUTER JOIN TUSER U ON
    TINQ.ASSIGNTO = U.USRID AND TINQ.CLNT = U.CLNT
    LEFT OUTER JOIN SERVTYP S ON
    TINQ.TYPSERV = S.STCODE
    LEFT OUTER JOIN MJOBSTAT J ON
    TINQ.STATUS = J.STATCD
    LEFT OUTER JOIN PREFMODCON C ON
    TINQ.MODOFCON = C.MODCODE
    LEFT OUTER JOIN MPRIORITY M ON
    TINQ.PRIORITY = M.PRTCD AND TINQ.CLNT = M.CLNT
    LEFT OUTER JOIN BESTTMCAL B ON
    TINQ.BESTTMCAL = B.TCODE AND TINQ.CLNT = B.CLNT
    LEFT OUTER JOIN servcat SC ON
    TINQ.CATCODE = SC.CATCODE AND TINQ.CLNT = SC.CLNT
    WHERE
    TINQ.CLNT = ? 
    AND TINQ.LANG = ? 
    AND
    (
        UPPER(COALESCE(TINQ.FULLNM, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.OFFICENM, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.PHONE, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.EMAILID, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.TYPSERV, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.STATUS, 'X')) LIKE UPPER(?) 
        AND UPPER(COALESCE(TINQ.CATCODE, 'X')) LIKE UPPER(?)
        AND UPPER(ASSIGNTO) = UPPER(?)
    ) 
    AND TINQ.ISDEL = 'N'
    ORDER BY
    CONVERT(TINQ.CID, UNSIGNED)	DESC
`;


// Query for Searching contacts for exact match
export const searchMatchingContactsQuery = `
    SELECT
        *,
        coalesce(UDATE, CDATE) As UDATEORD
    FROM
        TCONTACTS TCONT
    WHERE
        TCONT.CLNT = ? 
        AND TCONT.LANG = ? 
        AND
        (
            UPPER(COALESCE(TCONT.DISNAME, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TCONT.COMPANY, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TCONT.PHONE, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TCONT.EMAILID, 'X')) LIKE UPPER(?)
        ) 
        AND TCONT.ISDEL = 'N'
    ORDER BY
        UDATEORD DESC
`;

// Query for Searching contacts for any match
export const searchAnyContactsQuery = `
    SELECT
        *,
        coalesce(UDATE, CDATE) As UDATEORD
    FROM
        TCONTACTS TCONT
    WHERE
        TCONT.CLNT = ? 
        AND TCONT.LANG = ? 
        AND
        (
            UPPER(COALESCE(TCONT.DISNAME, 'X')) LIKE UPPER(?) 
            OR UPPER(COALESCE(TCONT.COMPANY, 'X')) LIKE UPPER(?) 
            OR UPPER(COALESCE(TCONT.PHONE, 'X')) LIKE UPPER(?) 
            OR UPPER(COALESCE(TCONT.EMAILID, 'X')) LIKE UPPER(?)
        ) 
        AND TCONT.ISDEL = 'N'
    ORDER BY
        UDATEORD DESC
`;


/* // Query for gettings contact details
export const getContactDetailsQuery = `
    SELECT *  
    FROM TCONTACTS TCONT 
    WHERE TCONT.CLNT=? 
        AND TCONT.LANG=?  
        AND TCONT.CONTACTID=? 
`; */

// Query for gettings contact details
export const getContactDetailsQuery = `
    SELECT *  
    FROM TCONTACTS TCONT 
    WHERE TCONT.CLNT=? 
        AND TCONT.LANG=?  
        AND TRIM(TCONT.CONTACTID) LIKE TRIM(?)
        AND UPPER(TRIM(EMAILID)) LIKE UPPER(TRIM(?))
	    AND TCONT.ISDEL='N'
`;


// Query for Searching customers for exact match
export const searchMatchingCustomersQuery = `
    SELECT
        CDTL.CCODE,
        CDTL.FIRSTNM,
        CDTL.LASTNM,
        CDTL.CMAIL,
        CDTL.CELLNO AS "PHNO",
        CDTL.OFFICENM,
        CDTL.ADDR,
        CDTL.CITY,
        CDTL.PINC,
        CDTL.FAXNO,
        BESTCAL.TDESC AS "BESTTMCAL",
        PREFMOD.MODDESC AS "MODOFCON",
        CDTL.STATE,
        CDTL.COUNTRY
    FROM
        MCUST CDTL
    LEFT JOIN BESTTMCAL BESTCAL ON
        BESTCAL.TCODE = CDTL.BESTTMCAL
    LEFT JOIN PREFMODCON PREFMOD ON
        PREFMOD.MODCODE = CDTL.MODOFCON
    WHERE
        CDTL.CLNT = ? 
        AND CDTL.LANG = ? 
        AND UPPER(CDTL.FIRSTNM) LIKE UPPER(?) 
        AND UPPER(CDTL.LASTNM) LIKE UPPER(?) 
        AND UPPER(CDTL.CMAIL) LIKE UPPER(?) 
        AND COALESCE(UPPER(CDTL.CELLNO),'%') LIKE UPPER(?) 
        AND CDTL.ISDEL = 'N'
    ORDER BY
        CONVERT(CDTL.CCODE, UNSIGNED)  DESC
    
`;


// Query for Searching customers for any match
export const searchAnyCustomersQuery = `
    SELECT
        CDTL.CCODE,
        CDTL.FIRSTNM,
        CDTL.LASTNM,
        CDTL.CMAIL,
        CDTL.PHNO,
        CDTL.OFFICENM,
        CDTL.ADDR,
        CDTL.CITY,
        CDTL.PINC,
        CDTL.FAXNO,
        (
            SELECT
                STDESC
            FROM
                STATENM
            WHERE
                CLNT = CDTL.CLNT AND LANG = CDTL.LANG AND STCODE = CDTL.STATE
        ) AS "STATE",
        (
            SELECT
                TDESC
            FROM
                BESTTMCAL
            WHERE
                CLNT = CDTL.CLNT AND LANG = CDTL.LANG AND TCODE = CDTL.BESTTMCAL
        ) AS "BESTTMCAL",
        (
            SELECT
                MODDESC
            FROM
                PREFMODCON
            WHERE
                CLNT = CDTL.CLNT AND LANG = CDTL.LANG AND MODCODE = CDTL.MODOFCON
        ) AS "MODOFCON",
        (
            SELECT
                CNAME
            FROM
                MCOUNTRY1
            WHERE
                CLNT = CDTL.CLNT AND LANG = CDTL.LANG AND CID = CDTL.COUNTRY
        ) AS "COUNTRY"
    FROM
        MCUST CDTL
    WHERE
        CDTL.CLNT = ? 
        AND CDTL.LANG = ? 
        AND
        (
            UPPER(CDTL.FIRSTNM) LIKE UPPER(?) 
            OR UPPER(CDTL.LASTNM) LIKE UPPER(?) 
            OR UPPER(CDTL.CMAIL) LIKE UPPER(?) 
            OR UPPER(CDTL.PHNO) LIKE UPPER(?)
        ) 
        AND CDTL.ISDEL = 'N'
    ORDER BY
        CONVERT(CDTL.CCODE, UNSIGNED)  DESC
        
`;


/* // Query for gettings customer details
export const getCustomerDetailsQuery = `
    SELECT * 
    FROM MCUST 
    WHERE CLNT=? 
        AND LANG=? 
        AND CCODE=?
	    AND ISDEL='N'
`; */

// Query for gettings customer details
export const getCustomerDetailsQuery = `
    SELECT * 
    FROM MCUST 
    WHERE CLNT=? 
        AND LANG=? 
        AND TRIM(CCODE) LIKE TRIM(?)
        AND UPPER(TRIM(CMAIL)) LIKE UPPER(TRIM(?))
	    AND ISDEL='N'
`;


// Query for Searching users for exact match
export const searchMatchingUsersQuery = `
(
    SELECT
        TUSR.FNAME,
        TUSR.LNAME,
        TUSR.USRID,
        TUSR.USRNM,
        TUSR.USEX,
        TUSR.UMAIL,
        TUSR.PHNO,
        TUSR.CELLNO,
        TUSR.ADDR,
        TUSR.CITY,
        TUSR.COUNTRY,
        TUSR.PINC
    FROM
        TUSER TUSR
    WHERE
        TUSR.CLNT = ? 
        AND TUSR.LANG = ? 
        AND UPPER(TUSR.USRID) IN
        (
            SELECT
                USRID
            FROM
                TGPUSR
            WHERE
                GRPID IN('EXUSRS', 'EXINV')
        ) 
        AND(
            UPPER(TUSR.USRID) LIKE UPPER(?)
        ) 
        AND(
            COALESCE(UPPER(TUSR.USRNM),'%') LIKE UPPER(?)
        ) 
        AND(
            UPPER(TUSR.UMAIL) LIKE UPPER(?)
        ) 
        AND(
            UPPER(TUSR.CELLNO) LIKE UPPER(?)
        ) 
        AND TUSR.ISDEL = 'N'
    )

    UNION

    (
        SELECT
            TUSR.FNAME,
            TUSR.LNAME,
            TUSR.USRID,
            TUSR.USRNM,
            TUSR.USEX,
            TUSR.UMAIL,
            TUSR.PHNO,
            TUSR.CELLNO,
            TUSR.ADDR,
            TUSR.CITY,
            TUSR.COUNTRY,
            TUSR.PINC
        FROM
            TUSER TUSR
        WHERE
            TUSR.CLNT = ? 
            AND TUSR.LANG = ? 
            AND UPPER(TUSR.USRID) NOT IN
            (
                SELECT
                    USRID
                FROM
                    TGPUSR TGP
                WHERE
                    TGP.CLNT = TUSR.CLNT AND TGP.LANG = TUSR.LANG AND TGP.usrid = TUSR.USRID
            ) 
            AND(
                UPPER(TUSR.USRID) LIKE UPPER(?)
            ) 
            AND(
                COALESCE(UPPER(TUSR.USRNM),'%') LIKE UPPER(?)
            ) 
            AND(
                UPPER(TUSR.UMAIL) LIKE UPPER(?)
            ) 
            AND(
                UPPER(TUSR.CELLNO) LIKE UPPER(?)
            ) 
            AND TUSR.ISDEL = 'N'
    )
    ORDER BY  FNAME
`;


// Query for Searching users for any match
export const searchAnyUsersQuery = `
    SELECT
        TUSR.FNAME,
        TUSR.LNAME,
        TUSR.USRID,
        TUSR.USRNM,
        TUSR.USEX,
        TUSR.UMAIL,
        TUSR.PHNO,
        TUSR.CELLNO,
        TUSR.ADDR,
        TUSR.CITY,
        TUSR.COUNTRY,
        TUSR.PINC
    FROM
        TUSER TUSR
    WHERE
        TUSR.CLNT = ? 
        AND TUSR.LANG = ? 
        AND
        (
            (
                UPPER(TUSR.USRID) LIKE UPPER(?)
            ) OR(
                UPPER(TUSR.USRNM) LIKE UPPER(?)
            ) OR(
                UPPER(TUSR.UMAIL) LIKE UPPER(?)
            ) OR(
                UPPER(TUSR.CELLNO) LIKE UPPER(?)
            )
        ) 
        AND TUSR.ISDEL = 'N'
    ORDER BY  TUSR.FNAME
`;


// Query for checking duplicate users
export const checkDuplicateUsersQuery = `
    SELECT COUNT(*) COUNT 
    FROM TUSER 
    WHERE CLNT=? 
        AND LANG=? 
        AND USRID=?
`;


// Query for gettings user details
export const getUserDetailsQuery = `
    SELECT * 
    FROM TUSER 
    WHERE CLNT=? 
        AND LANG=?
        AND USRID=? 
`;

// Query for Searching dashboard tasks
export const searchDashboardTasksQuery = `
    SELECT  
        T.TASKID,
        T.CLNT,
        T.LANG,
        U.USRNM TASKFOR,
        O.USRNM TASKOWNER,
        T.SUBJECT,
        T.STARTDATE,
        T.DUEDATE,
        T.STATUSID,
        S.STATUS STATUS,
        T.PRIORITYID,
        P.PRIORITY PRIORITY,
        T.PERCNTCOMPL,
        T.REMINDERREQ,
        T.REMINDERDT,
        T.REMINDERTM,
        T.TASKDETAILS
    FROM    T_TASKS T
    LEFT OUTER JOIN TUSER U 
    ON T.TASKFOR = U.USRID
        AND T.CLNT = U.CLNT
        AND T.LANG = U.LANG
    LEFT OUTER JOIN TUSER O
    ON T.TASKOWNER = O.USRID
        AND T.CLNT = O.CLNT
        AND T.LANG = O.LANG
    LEFT OUTER JOIN T_TASKSTATUS S
    ON T.STATUSID = S.STATUSID
        AND T.CLNT = S.CLNT
        AND T.LANG = S.LANG
        AND S.STATUSFOR = 'TASK'
    LEFT OUTER JOIN T_TASKPRIORITY P
    ON T.PRIORITYID = P.PRIORITYID
        AND T.CLNT = P.CLNT
        AND T.LANG = P.LANG
    WHERE   T.CLNT=?
        AND T.LANG=?  
        AND T.ISDEL='N' 
        AND T.STATUS='Completed' 
    ORDER BY T.DUEDATE
`;

// Query for Searching tasks for Admin user
export const searchAdminTasksQuery = `
    SELECT  
        T.TASKID,
        T.CLNT,
        T.LANG,
        U.USRNM TASKFOR,
        O.USRNM TASKOWNER,
        T.SUBJECT,
        T.STARTDATE,
        T.DUEDATE,
        T.STATUSID,
        S.STATUS STATUS,
        T.PRIORITYID,
        P.PRIORITY PRIORITY,
        T.PERCNTCOMPL,
        T.REMINDERREQ,
        T.REMINDERDT,
        T.REMINDERTM,
        T.TASKDETAILS,
        T.TASKOF,
		T.TASKOFID
    FROM    T_TASKS T
    LEFT OUTER JOIN TUSER U 
    ON T.TASKFOR = U.USRID
        AND T.CLNT = U.CLNT
        AND T.LANG = U.LANG
    LEFT OUTER JOIN TUSER O
    ON T.TASKOWNER = O.USRID
        AND T.CLNT = O.CLNT
        AND T.LANG = O.LANG
    LEFT OUTER JOIN T_TASKSTATUS S
    ON T.STATUSID = S.STATUSID
        AND T.CLNT = S.CLNT
        AND T.LANG = S.LANG
        AND S.STATUSFOR = 'TASK'
    LEFT OUTER JOIN T_TASKPRIORITY P
    ON T.PRIORITYID = P.PRIORITYID
        AND T.CLNT = P.CLNT
        AND T.LANG = P.LANG
    WHERE   T.CLNT=?
        AND T.LANG=?
        AND COALESCE(UPPER(T.STATUSID),'%') LIKE UPPER(?)
    	AND COALESCE(UPPER(T.SUBJECT),'%') LIKE UPPER(?)
        AND COALESCE(UPPER(U.USRID),'%') LIKE UPPER(?)
        AND COALESCE(UPPER(T.PRIORITYID),'%') LIKE UPPER(?)
        AND T.DUEDATE BETWEEN ? AND ?
        AND COALESCE(UPPER(T.TASKOF),'%') LIKE UPPER(?)
		AND COALESCE(UPPER(T.TASKOFID),'%') LIKE UPPER(?)
        AND T.ISDEL='N' 
    ORDER BY CAST(T.TASKID AS INT) DESC
`;

// Query for Searching tasks for User other than Admin
export const searchUserTasksQuery = `
    SELECT  
        T.TASKID,
        T.CLNT,
        T.LANG,
        U.USRNM TASKFOR,
        O.USRNM TASKOWNER,
        T.SUBJECT,
        T.STARTDATE,
        T.DUEDATE,
        T.STATUSID,
        S.STATUS STATUS,
        T.PRIORITYID,
        P.PRIORITY PRIORITY,
        T.PERCNTCOMPL,
        T.REMINDERREQ,
        T.REMINDERDT,
        T.REMINDERTM,
        T.TASKDETAILS
    FROM    T_TASKS T
    LEFT OUTER JOIN TUSER U 
    ON T.TASKFOR = U.USRID
        AND T.CLNT = U.CLNT
        AND T.LANG = U.LANG
    LEFT OUTER JOIN TUSER O
    ON T.TASKOWNER = O.USRID
        AND T.CLNT = O.CLNT
        AND T.LANG = O.LANG
    LEFT OUTER JOIN T_TASKSTATUS S
    ON T.STATUSID = S.STATUSID
        AND T.CLNT = S.CLNT
        AND T.LANG = S.LANG
        AND S.STATUSFOR = 'TASK'
    LEFT OUTER JOIN T_TASKPRIORITY P
    ON T.PRIORITYID = P.PRIORITYID
        AND T.CLNT = P.CLNT
        AND T.LANG = P.LANG
    WHERE   T.CLNT=?
        AND T.LANG=?  
        AND T.ISDEL='N' 
        AND T.CUSER=? 
    ORDER BY T.DUEDATE

`;

// Query for Searching tasks for logged in User

export const searchLoggedUserTasksQuery = `
    SELECT  
        T.TASKID,
        T.CLNT,
        T.LANG,
        U.USRNM TASKFOR,
        O.USRNM TASKOWNER,
        T.SUBJECT,
        T.STARTDATE,
        T.DUEDATE,
        T.STATUSID,
        S.STATUS STATUS,
        T.PRIORITYID,
        P.PRIORITY PRIORITY,
        T.PERCNTCOMPL,
        T.REMINDERREQ,
        T.REMINDERDT,
        T.REMINDERTM,
        T.TASKDETAILS,
        T.TASKOF,
		T.TASKOFID
    FROM    T_TASKS T
    LEFT OUTER JOIN TUSER U 
    ON T.TASKFOR = U.USRID
        AND T.CLNT = U.CLNT
        AND T.LANG = U.LANG
    LEFT OUTER JOIN TUSER O
    ON T.TASKOWNER = O.USRID
        AND T.CLNT = O.CLNT
        AND T.LANG = O.LANG
    LEFT OUTER JOIN T_TASKSTATUS S
    ON T.STATUSID = S.STATUSID
        AND T.CLNT = S.CLNT
        AND T.LANG = S.LANG
        AND S.STATUSFOR = 'TASK'
    LEFT OUTER JOIN T_TASKPRIORITY P
    ON T.PRIORITYID = P.PRIORITYID
        AND T.CLNT = P.CLNT
        AND T.LANG = P.LANG
    WHERE   T.CLNT=?
        AND T.LANG=?  
        AND T.ISDEL='N' 
        AND UPPER(T.TASKFOR) = UPPER(?)
        AND COALESCE(UPPER(T.STATUSID),'%') LIKE UPPER(?)
        AND COALESCE(UPPER(T.SUBJECT),'%') LIKE UPPER(?)
        AND COALESCE(UPPER(O.USRID),'%') LIKE UPPER(?)
        AND COALESCE(UPPER(T.PRIORITYID),'%') LIKE UPPER(?)
        AND T.DUEDATE BETWEEN ? AND ?
        AND COALESCE(UPPER(T.TASKOF),'%') LIKE UPPER(?)
		AND COALESCE(UPPER(T.TASKOFID),'%') LIKE UPPER(?)
    ORDER BY CAST(T.TASKID AS INT) DESC
`;

// Query for Searching dashboard tasks for logged in User
export const searchLoggedUserDashboardTasksQuery = `
    SELECT  
        T.TASKID,
        T.CLNT,
        T.LANG,
        U.USRNM TASKFOR,
        O.USRNM TASKOWNER,
        T.SUBJECT,
        T.STARTDATE,
        T.DUEDATE,
        T.STATUSID,
        S.STATUS STATUS,
        T.PRIORITYID,
        P.PRIORITY PRIORITY,
        T.PERCNTCOMPL,
        T.REMINDERREQ,
        T.REMINDERDT,
        T.REMINDERTM,
        T.TASKDETAILS
    FROM    T_TASKS T
    LEFT OUTER JOIN TUSER U 
    ON T.TASKFOR = U.USRID
        AND T.CLNT = U.CLNT
        AND T.LANG = U.LANG
    LEFT OUTER JOIN TUSER O
    ON T.TASKOWNER = O.USRID
        AND T.CLNT = O.CLNT
        AND T.LANG = O.LANG
    LEFT OUTER JOIN T_TASKSTATUS S
    ON T.STATUSID = S.STATUSID
        AND T.CLNT = S.CLNT
        AND T.LANG = S.LANG
        AND S.STATUSFOR = 'TASK'
    LEFT OUTER JOIN T_TASKPRIORITY P
    ON T.PRIORITYID = P.PRIORITYID
        AND T.CLNT = P.CLNT
        AND T.LANG = P.LANG
    WHERE   T.CLNT=?
        AND T.LANG=?  
        AND T.TASKFOR = ?
        AND T.ISDEL='N' 
        AND ( T.STATUS='Pending' OR T.STATUS='New') 
    ORDER BY T.DUEDATE
`;


// Query for checking duplicate tasks
export const checkDuplicateTasksQuery = `
    SELECT COUNT(*) COUNT 
    FROM T_TASKS 
    WHERE CLNT=? 
        AND LANG=? 
        AND TASKID=?
`;


// Query for gettings task details
export const getTaskDetailsQuery = `
    SELECT * 
    FROM T_TASKS  
    WHERE CLNT=? 
        AND LANG=?  
        AND TASKID=? 
`;


// Query for Searching dashboard leads
export const searchDashboardLeadsQuery = `
    SELECT
        TINQ.LSTNM,
        B.TDESC AS BESTTMCAL,
        TINQ.FRSTNM,
        M.PRTDESC AS PRIORITY,
        TINQ.FULLNM,
        TINQ.EMAILID,
        TINQ.PHONE,
        TINQ.CID,
        TINQ.CDATE,
        TINQ.OFFICENM,
        TINQ.CSOURCE,
        U.USRNM ASSIGNTO,
        S.STDESC STDESC,
        J.STATDSC STATUS,
        MODDESC,
        (
            SELECT
                SRCMODENM
            FROM
                SOURCEMODE
            WHERE
                SRCMODECD = TINQ.MODEOFSRC
        ) MODEOFSRC,
        TINQ.LEADNOTES ADDCOMMETS,
        CASE WHEN TINQ.UDATE IS NULL THEN TINQ.CDATE 
            ELSE TINQ.UDATE
        END AS LSTUPDT
    FROM
        EXLEADS TINQ
    LEFT OUTER JOIN TUSER U ON
        TINQ.ASSIGNTO = U.USRID AND TINQ.CLNT = U.CLNT
    LEFT OUTER JOIN SERVTYP S ON
        TINQ.TYPSERV = S.STCODE
    LEFT OUTER JOIN MJOBSTAT J ON
        TINQ.STATUS = J.STATCD
    LEFT OUTER JOIN PREFMODCON C ON
        TINQ.MODOFCON = C.MODCODE
    LEFT OUTER JOIN MPRIORITY M ON
        TINQ.PRIORITY = M.PRTCD AND TINQ.CLNT = M.CLNT
    LEFT OUTER JOIN BESTTMCAL B ON
        TINQ.BESTTMCAL = B.TCODE AND TINQ.CLNT = B.CLNT
    WHERE
        TINQ.CLNT = ? 
        AND TINQ.LANG = ? 
        AND
        (
            UPPER(COALESCE(TINQ.FULLNM, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.OFFICENM, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.PHONE, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.EMAILID, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.TYPSERV, 'X')) LIKE UPPER(?) 
            AND UPPER(COALESCE(TINQ.STATUS, 'X')) LIKE UPPER(?)
        ) 
        AND TINQ.ISDEL = 'N' 
        AND TINQ.STATUS = '01'
    ORDER BY
        CONVERT(TINQ.CID, UNSIGNED) DESC
`;


// Query for Searching Company Documents
export const searchCompanyDocumentsQuery = `
    SELECT  * 
    FROM    EXCELDOCUMENT 
    WHERE   CLNT=? 
            AND LANG=? 
            AND ISDEL='N'
`;


// Query for Searching billable hours Header
export const searchBillableHoursHeaderQuery = `
    SELECT
        CONCAT
        (
            CLNTDTL.FIRSTNM,
            ' ',
            CLNTDTL.LASTNM
        ) CLIENTNAME,
        PRGWRK.CIDSYS,
        SUM(PRGWRK.WORKHOURS) CLNTHW,
        CLNTDTL.CLNTID,
        CLNTDTL.FIRSTNM
    FROM
        TPROGRESSWORK PRGWRK,
        CLIENTDETAILS CLNTDTL,
        CASEDETAILS CASEDTL
    WHERE
        CLNTDTL.CLNTID = CASEDTL.CLIENTID 
        AND CLNTDTL.CLNT = CASEDTL.CLNT 
        AND CLNTDTL.LANG = CASEDTL.LANG 
        AND PRGWRK.LANG = CASEDTL.LANG 
        AND PRGWRK.CLNT = CASEDTL.CLNT 
        AND PRGWRK.CIDSYS = CASEDTL.CIDSYS 
        AND PRGWRK.CLNT = ? 
        AND PRGWRK.LANG = ? 
        AND PRGWRK.CDATE BETWEEN ? AND ? 
        AND CASEDTL.ISDEL <> 'Y' 
        AND PRGWRK.ISDEL <> 'Y' 
        AND COALESCE(PRGWRK.ISBILLED,'N') <> 'Y'
        AND COALESCE(UPPER(CLNTDTL.FIRSTNM),'%') LIKE UPPER(?)  
        AND COALESCE(UPPER(CLNTDTL.LASTNM),'%') LIKE UPPER(?)
        GROUP BY
        CLNTDTL.CLNTID, CLNTDTL.FIRSTNM,
            CLNTDTL.LASTNM,  PRGWRK.CIDSYS
`;



// Query for Searching billable hours Details
export const searchBillableHoursDetailsQuery = `
    SELECT 	  PRGWORK.CIDSYS,
        PRGWORK.PRGRPTID,
        CONCAT( CNLDT.FIRSTNM,  ' ', CNLDT.LASTNM ) CLIENTNAME,
        CD.SERVICETYP,
        PRGWORK.CDATE AS "RPTDATE",
        PRGWORK.RPTTXT, 
        PRGWORK.WORKCAT, 
        PRGWORK.CDATE, 
        PRGWORK.WORKHOURS,
        (SELECT IFNULL((SELECT RATE FROM TRATECARDCASES WHERE WORKCAT=PRGWORK.WORKCAT AND CIDSYS= PRGWORK.CIDSYS AND ISDEL='N'),(SELECT RATE FROM TWORKCAT WHERE CATCD=PRGWORK.WORKCAT AND ISDEL='N')) )AS RATE,
        CD.CASETL,
        CNLDT.CLNTID,
        W.CATDESC,
        PRGWORK.PRGWORKID
    FROM TPROGRESSWORK PRGWORK 
    LEFT OUTER JOIN TWORKCAT W ON  PRGWORK.WORKCAT=W.CATCD AND W.ISDEL='N' AND W.CLNT= PRGWORK.CLNT AND W.LANG=PRGWORK.LANG
    LEFT OUTER JOIN CASEDETAILS CD ON  PRGWORK.CIDSYS=CD.CIDSYS AND CD.ISDEL='N' AND CD.CLNT= PRGWORK.CLNT AND CD.LANG=PRGWORK.LANG 
    LEFT OUTER JOIN CLIENTDETAILS CNLDT ON CD.CLIENTID=CNLDT.CLNTID
    WHERE 
        COALESCE(PRGWORK.ISBILLED,'N') <> 'Y'
        AND PRGWORK.CLNT =?
        AND PRGWORK.LANG =?
        AND CNLDT.CLNTID=?
        AND PRGWORK.CDATE BETWEEN ? AND ?
        AND CD.ISDEL='N'
`;

// Query for Searching billable hours for Case
export const searchBillableCaseHoursQuery = `
SELECT
    CONCAT(
        CLNTDTL.FIRSTNM,
        ' ',
        CLNTDTL.LASTNM
    ) CLIENTNAME,
    CSEDTL.CASETL,
    CSEDTL.SERVICETYP,
    PRGWORK.CDATE AS "RPTDATE",
    PRGWORK.RPTTXT,
    PRGWORK.WORKCAT,
    TWC.CATDESC,
    PRGWORK.CDATE,
    PRGWORK.CUSER,
    PRGWORK.WORKHOURS,
    PRGWORK.PRGRPTID,
    CSEDTL.CIDSYS,
    CLNTDTL.CLNTID,
    PRGWORK.PRGWORKID,
    PRGWORK.ISBILLED,
    (
    SELECT
        IFNULL(
            (
            SELECT
                RATE
            FROM
                TRATECARDCASES
            WHERE
                WORKCAT = PRGWORK.WORKCAT AND CIDSYS = CSEDTL.CIDSYS AND ISDEL = 'N'
        ),
        (
        SELECT
            RATE
        FROM
            TWORKCAT
        WHERE
            CATCD = PRGWORK.WORKCAT AND ISDEL = 'N'
    )
        )
) AS RATE
FROM
    CLIENTDETAILS CLNTDTL,
    CASEDETAILS CSEDTL,
    TPROGRESSWORK PRGWORK
LEFT OUTER JOIN TWORKCAT TWC ON
    PRGWORK.WORKCAT = TWC.CATCD AND TWC.ISDEL = 'N' AND TWC.CLNT = PRGWORK.CLNT AND TWC.LANG = PRGWORK.LANG
WHERE
    CLNTDTL.CLNT = CSEDTL.CLNT AND CLNTDTL.LANG = CSEDTL.LANG AND CLNTDTL.CLNTID = CSEDTL.CLIENTID 
    AND PRGWORK.ISDEL <> 'Y' 
    AND PRGWORK.CLNT = ? AND PRGWORK.LANG = ? 
    AND CSEDTL.CIDSYS = PRGWORK.CIDSYS 
    AND CLNTDTL.CLNTID = ? AND CSEDTL.CIDSYS = ? 
    AND PRGWORK.CDATE BETWEEN ? AND ? 
    AND CSEDTL.ISDEL = 'N'
    AND UPPER(COALESCE(PRGWORK.ISBILLED,'N')) LIKE UPPER(?)
ORDER BY
    PRGWORK.WORKCAT,
    PRGWORK.CDATE
`;


// Query for Searching invoices
export const searchInvoicesQuery = `
    SELECT
        HDR.CLNT,
        HDR.LANG,
        HDR.CIDSYS,
        HDR.DOCID,
        HDR.DOCDT,
        HDR.DOCTYPE,
        HDR.DOCNO,
        HDR.PONO,
        HDR.RMKS,
        HDR.CURRENCY,
        HDR.DUEDT,
        HDR.DOCHDR,
        HDR.TOT,
        HDR.CUSTCD,
        HDR.INVDT,
        HDR.BAL,
        HDR.CMPN,
        HDR.CMPNNM,
        HDR.CUSTOMER,
        HDR.ISDEL,
        HDR.STATUS,
        STS.STATUS STATUSDSC,
        HDR.PAYMENTBY
    FROM
        TDOCHDR HDR,
        T_TASKSTATUS STS
    WHERE 
        HDR.CLNT=STS.CLNT 
        AND HDR.LANG=STS.LANG
        AND HDR.STATUS=STS.STATUSID 
        AND	HDR.CLNT=? 
        AND HDR.LANG=? 
        AND HDR.ISDEL='N' 
        AND HDR.DOCTYPE=? 
        AND UPPER(HDR.DOCNO) LIKE UPPER(?)
        AND UPPER(HDR.CUSTOMER) LIKE UPPER(?)
        AND UPPER(HDR.CMPNNM) LIKE UPPER(?)
        AND UPPER(HDR.CIDSYS) LIKE UPPER(?)
        AND HDR.DOCDT BETWEEN ? AND ?
        AND STS.STATUSFOR='INVOICE' 
        AND HDR.DOCNO IS NOT NULL AND HDR.DOCNO !=''
        AND UPPER(HDR.CUSTCD) LIKE UPPER(?)
`;
/* Alternate query for invoices

    SELECT
        HDR.CLNT,
        HDR.LANG,
        HDR.CIDSYS,
        HDR.DOCID,
        HDR.DOCDT,
        HDR.DOCTYPE,
        HDR.DOCNO,
        HDR.PONO,
        HDR.RMKS,
        HDR.CURRENCY,
        HDR.DUEDT,
        HDR.DOCHDR,
        HDR.TOT,
        HDR.CUSTCD,
        HDR.INVDT,
        HDR.BAL,
        HDR.CMPN,
        HDR.CMPNNM,
        HDR.CUSTOMER,
        HDR.ISDEL,
        HDR.STATUS,
        STS.STATUS STATUSDSC,
        HDR.PAYMENTBY,
        C.CMAIL COMPMAIL, V.CMAIL CUSTMAIL
    FROM
        TDOCHDR HDR,
        T_TASKSTATUS STS,
        MCMPN C, 
        MCUST V 
    WHERE 
        HDR.CLNT=STS.CLNT 
        AND HDR.LANG=STS.LANG
        AND HDR.STATUS=STS.STATUSID 
        AND HDR.CLNT=C.CLNT
    	and HDR.LANG=C.LANG
    	AND HDR.CLNT=V.CLNT
    	and HDR.LANG=V.LANG
        and C.CMPN = HDR.CMPN        
        and V.CCODE = HDR.CUSTCD
        AND	HDR.CLNT=? 
        AND HDR.LANG=? 
        AND HDR.ISDEL='N' 
        AND HDR.DOCTYPE='INV' 
        AND UPPER(HDR.DOCNO) LIKE UPPER(?)
        AND UPPER(HDR.CUSTOMER) LIKE UPPER(?)
        AND UPPER(HDR.CMPNNM) LIKE UPPER(?)
        AND HDR.DOCDT BETWEEN ? AND ?
        AND STS.STATUSFOR='INVOICE' 
        AND HDR.DOCNO IS NOT NULL AND HDR.DOCNO !=''
        AND V.ISDEL = 'N'
        AND C.ISDEL='N'

 */


// Original Query - Probably Causing Cartesian Product, See modified query below
/* // Query for Searching billed hours header
export const searchBilledHoursHeaderQuery = `
    SELECT 
        CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) CLIENTNAME,
        SUM(PRGWORK.WORKHOURS) CLNTBILLABLEHW, 
        SUM(D.QUANTITY) CLNTHW,
        CLNTDTL.CLNTID
    FROM 	CLIENTDETAILS CLNTDTL, 
            CASEDETAILS CSEDTL, 		   
            TPROGRESSWORK PRGWORK,TDOCDTL D,TDOCHDR H,
            (
                SELECT PRGWORKID
                FROM TPROGRESSWORK PRGWORK, TDOCDTL D, TDOCHDR H
                WHERE PRGWORK.DOCID = D.DOCID
                AND PRGWORK.LINEITEMNO = D.LINEITEMNO
                AND D.DOCID = H.DOCID
                AND H.DOCNO <> ''
            ) 	WRKID
    WHERE CLNTDTL.CLNT = CSEDTL.CLNT
        AND CLNTDTL.LANG = CSEDTL.LANG
        AND CLNTDTL.CLNTID = CSEDTL.CLIENTID
        AND PRGWORK.DOCID=D.DOCID 
        AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
        AND D.DOCID=H.DOCID 
        AND PRGWORK.PRGWORKID  = WRKID.PRGWORKID
        AND PRGWORK.CLNT =  ?
        AND PRGWORK.LANG = ?
    GROUP BY CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ),CLNTDTL.CLNTID
    ORDER BY CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM )
`;
 */

// Modified Query
// Query for Searching billed hours header
export const searchBilledHoursHeaderQuery = `
    SELECT 	CL.CLIENTNAME, CL.CLNTID,     
            COALESCE(SUM(PR.WORKHOURS),0) CLNTBILLABLEHW,
            COALESCE(SUM(PR.QUANTITY),0) CLNTHW
    FROM
    (
        SELECT DISTINCT
            CONCAT(
                CLNTDTL.FIRSTNM,
                ' ',
                CLNTDTL.LASTNM
            ) CLIENTNAME,
            CLNTDTL.CLNTID,
            CSEDTL.CIDSYS
        FROM
            CLIENTDETAILS CLNTDTL,
            CASEDETAILS CSEDTL
        WHERE CLNTDTL.CLNT = CSEDTL.CLNT
            AND CLNTDTL.LANG = CSEDTL.LANG
            AND CLNTDTL.CLNTID = CSEDTL.CLIENTID
    ) CL
    LEFT OUTER JOIN 
    (
        SELECT
            PRGWORK.CIDSYS,
            PRGWORK.WORKHOURS,
            D.QUANTITY
        FROM

            TPROGRESSWORK PRGWORK,
            TDOCDTL D,
            TDOCHDR H,
            VW_PROGRESSWORKID WRKID
        WHERE PRGWORK.DOCID=D.DOCID 
            AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
            AND D.DOCID=H.DOCID 
            AND (PRGWORK.LINEITEMNO <> '' OR TRIM(PRGWORK.LINEITEMNO) IS NOT NULL)
            AND (PRGWORK.DOCID <> '' OR TRIM(PRGWORK.DOCID) IS NOT NULL)
            AND PRGWORK.PRGWORKID  = WRKID.PRGWORKID
            AND PRGWORK.CLNT =  ?
            AND PRGWORK.LANG = ?
    ) PR
    ON CL.CIDSYS = PR.CIDSYS
    GROUP BY CL.CLIENTNAME, CL.CLNTID  
    ORDER BY CL.CLIENTNAME
`;


// Original Query - Probably Causing Cartesian Product, See modified query below
/* // Query for Searching billed hours details
export const searchBilledHoursDetailsQuery = `
    SELECT  H.DOCNO,H.DOCDT,  
        CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) CLIENTNAME,
        CSEDTL.CASETL,CSEDTL.SERVICETYP,  
        PRGWORK.CDATE AS RPTDATE,
        PRGWORK.RPTTXT, 
        PRGWORK.WORKCAT, 
        PRGWORK.CDATE, 
        PRGWORK.WORKHOURS CLNTBILLABLEHW,
        D.QUANTITY WORKHOURS, 
        PRGWORK.PRGRPTID, 
        CSEDTL.CIDSYS, 
        CLNTDTL.CLNTID,
        PRGWORK.PRGWORKID, 
        D.RATE
    FROM CLIENTDETAILS CLNTDTL, 
        CASEDETAILS CSEDTL, 
        TPROGRESSWORK PRGWORK,
        TDOCHDR H,
        TDOCDTL D
    WHERE CLNTDTL.CLNT = CSEDTL.CLNT
        AND CLNTDTL.LANG = CSEDTL.LANG
        AND CLNTDTL.CLNTID = CSEDTL.CLIENTID			
        AND PRGWORK.DOCID=D.DOCID 
        AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
        AND D.DOCID=H.DOCID 
        AND H.DOCNO <> ''
        AND PRGWORK.CLNT =  ?
        AND PRGWORK.LANG = ?
        AND CLNTDTL.CLNTID IN (
            select SUBSTRING_INDEX(SUBSTRING_INDEX(?,',',num),',',-1) as 'Name' 
            from 
            (
                select DISTINCT (t*10+u+1) as 'num' 
                from
                (	select 0 t union select 1 union select 2 union select 3 union select 4 union
                 select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                 union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                 union select 17 union select 18 union select 19 union select 20 
                ) A,
                (	select 0 u union select 1 union select 2 union select 3 union select 4 union
                 select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                 union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                 union select 17 union select 18 union select 19 union select 20 
                ) B

            ) nums
            where num < CHAR_LENGTH(?)-CHAR_LENGTH(REPLACE(?, ',', '')) + 2
            order by num
    )
    ORDER BY PRGWORK.WORKCAT,PRGWORK.CDATE
`; */

// Modified Query
// Query for Searching billed hours details
export const searchBilledHoursDetailsQuery = `
    SELECT  H.DOCNO,H.DOCDT,  
        CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) CLIENTNAME,
        CSEDTL.CASETL,CSEDTL.SERVICETYP,  
        PRGWORK.CDATE AS RPTDATE,
        PRGWORK.RPTTXT, 
        PRGWORK.WORKCAT, 
        PRGWORK.CDATE, 
        PRGWORK.WORKHOURS CLNTBILLABLEHW,
        D.QUANTITY WORKHOURS, 
        PRGWORK.PRGRPTID, 
        CSEDTL.CIDSYS, 
        CLNTDTL.CLNTID,
        PRGWORK.PRGWORKID, 
        D.RATE
    FROM CLIENTDETAILS CLNTDTL, 
        CASEDETAILS CSEDTL, 
        TPROGRESSWORK PRGWORK,
        TDOCHDR H,
        TDOCDTL D
    WHERE CLNTDTL.CLNT = CSEDTL.CLNT
        AND CLNTDTL.LANG = CSEDTL.LANG
        AND CLNTDTL.CLNTID = CSEDTL.CLIENTID			
        AND PRGWORK.DOCID=D.DOCID 
        AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
        AND D.DOCID=H.DOCID 
        AND H.DOCNO <> ''
        AND CSEDTL.CIDSYS = PRGWORK.CIDSYS
        AND COALESCE(PRGWORK.ISBILLED,'N') = 'Y'    
        AND PRGWORK.ISDEL = 'N'
        AND PRGWORK.CLNT =  ?
        AND PRGWORK.LANG = ?
        AND CLNTDTL.CLNTID IN (
            select SUBSTRING_INDEX(SUBSTRING_INDEX(?,',',num),',',-1) as 'Name' 
            from 
            (
                select DISTINCT (t*10+u+1) as 'num' 
                from
                (	select 0 t union select 1 union select 2 union select 3 union select 4 union
                 select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                 union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                 union select 17 union select 18 union select 19 union select 20 
                ) A,
                (	select 0 u union select 1 union select 2 union select 3 union select 4 union
                 select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                 union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                 union select 17 union select 18 union select 19 union select 20 
                ) B

            ) nums
            where num < CHAR_LENGTH(?)-CHAR_LENGTH(REPLACE(?, ',', '')) + 2
            order by num
    )
    ORDER BY PRGWORK.WORKCAT,PRGWORK.CDATE
`;


// Query for getting next number in series
export const nextSeriesNumberQuery = `
    SELECT CRNT 
    FROM TSERIES
    WHERE CLNT = ?
        AND CMPN = ?
        AND STYPE = ?
`;

// Query for checking duplicate clients
export const checkDuplicateClientsQuery = `
    SELECT COUNT(*) COUNT 
    FROM CLIENTDETAILS 
    WHERE CLNT=? 
        AND LANG=? 
        AND CLNTID=?
`;


// Query for checking duplicate clients using email id
export const checkDuplicateClientsEmailQuery = `
    SELECT COUNT(*) COUNT 
    FROM CLIENTDETAILS 
    WHERE CLNT=? 
        AND LANG=? 
        AND UPPER(TRIM(EMAILID))=UPPER(TRIM(?))
`;


// Query for gettings client details
/* export const getClientDetailsQuery = `
    SELECT * 
    FROM CLIENTDETAILS 
    WHERE CLNT=? 
        AND LANG=? 
        AND CLNTID=?
`;
 */
export const getClientDetailsQuery = `
    SELECT * 
    FROM CLIENTDETAILS 
    WHERE CLNT=? 
        AND LANG=? 
        AND TRIM(CLNTID) LIKE TRIM(?)
        AND TRIM(UPPER(EMAILID)) LIKE TRIM(UPPER(?))
`;



// Query for checking duplicate cases
export const checkDuplicateCasesQuery = `
SELECT COUNT(*) COUNT 
FROM CASEDETAILS 
WHERE CLNT=? 
    AND LANG=? 
    AND CIDSYS=?
`;


// Query for checking duplicate leads
export const checkDuplicateLeadsQuery = `
    SELECT COUNT(*) COUNT 
    FROM EXLEADS 
    WHERE CLNT=? 
        AND LANG=? 
        AND CID=?
`;


// Query for ddl Service(s) Required
export const servicesRequiredDDLQuery = `
    SELECT DISTINCT STCODE AS "CODE", STDESC AS "DESC" 
    FROM SERVTYP 
    WHERE CLNT=? 
        AND LANG=? 
        AND CATCODE=?
        AND ISDEL='N' 
    ORDER BY STDESC
`;


// Query for ddl Best Time To Call
export const bestTimeToCallDDLQuery = `
    SELECT DISTINCT TCODE AS "CODE", TDESC AS "DESC" 
    FROM BESTTMCAL 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N' 
    ORDER BY TDESC
`;

// Query for ddl Best Method of Contact
export const bestMethodofContactDDLQuery = `
SELECT DISTINCT MODCODE AS "CODE", MODDESC AS "DESC" 
FROM PREFMODCON 
WHERE CLNT=? 
    AND LANG=? 
    AND ISDEL='N' 
ORDER BY MODDESC
`;


// Query for ddl Priority Level
export const priorityLevelDDLQuery = `
SELECT DISTINCT PRTCD AS "CODE", PRTDESC AS "DESC" 
FROM MPRIORITY 
WHERE CLNT=? 
    AND LANG=? 
    AND ISDEL='N' 
ORDER BY PRTDESC
`;


// Query for ddl Source of Leads
export const sourceofLeadsDDLQuery = `
SELECT DISTINCT SRCMODECD AS "CODE", SRCMODENM AS "DESC"
FROM SOURCEMODE 
WHERE CLNT=? 
    AND LANG=? 
    AND ISDEL='N' 
ORDER BY SRCMODENM
`;


// Query for gettings leads details
export const getLeadsDetailsQuery = `
SELECT
    TINQ.FULLNM,
    TINQ.EMAILID,
    TINQ.PHONE,
    TINQ.CID,
    TINQ.CDATE,
    TINQ.OFFICENM,
    TINQ.CSOURCE,
    TINQ.MODEOFSRC,
    TINQ.CATCODE,
    TINQ.TYPSERV,
    TINQ.DESCRIPTION,
    TINQ.BESTTMCAL,
    TINQ.MODOFCON,
    TINQ.ADDCOMMETS,
    TINQ.STATUS,
    TINQ.LSTNM,
    TINQ.FRSTNM,
    TINQ.ADDRESS,
    TINQ.CITY,
    TINQ.PRIORITY,
    TINQ.STATE,
    TINQ.ZIPCD,
    TINQ.ASSIGNTO,
    CASE WHEN TINQ.UDATE IS NULL THEN TINQ.CDATE 
    	ELSE TINQ.UDATE
	END AS LSTUPDT
FROM
    EXLEADS TINQ
WHERE
    TINQ.CLNT = ?
    AND TINQ.LANG = ? 
    AND TINQ.CID = ?
    AND TINQ.ISDEL = 'N'
`;


// Query for ddl Status
export const statusDDLQuery = `
    SELECT DISTINCT STATCD AS "CODE", STATDSC AS "DESC" 
    FROM MJOBSTAT 
    WHERE CLNT=?  
        AND LANG=?  
        AND ISDEL='N' 
    ORDER BY STATDSC
`;

// Query for ddl Assign To
export const assignToDDLQuery = `
    SELECT  DISTINCT TUSR.USRID AS "CODE", TUSR.USRNM AS "DESC"
    FROM    TUSER TUSR,
            MCOUNTRY1 CNTRY
    WHERE
            TUSR.CLNT=CNTRY.CLNT AND
            TUSR.LANG=CNTRY.LANG AND
            TUSR.COUNTRY=CNTRY.CID AND
            UPPER(TUSR.USRID) IN (SELECT USRID FROM TGPUSR WHERE GRPID IN ('EXUSRS','EXINV')) AND
            TUSR.CLNT=? AND
            TUSR.LANG=? AND
            TUSR.ISDEL='N'
    ORDER BY TRIM(TUSR.USRNM) ASC
`;


// Query for ddl Leads document type
export const leadsDocTypeDDLQuery = `
    SELECT 'Select' AS "CODE", 'Select' AS "DESC" UNION
    SELECT 'Document', 'Document'  UNION
    SELECT 'Media', 'Media' 
`;


// Query for Searching Uploaded Documents
export const searchUploadedDocumentsQuery = `
    SELECT 
        TIM.CENTITY,
        TIM.CENTITYID,
        TIM.CIMGDOC,
        TIM.CDOCTYPE,
        TIM.CDOCDESC,
        TIM.CDOCEXTENSION,
        TIM.CDOCSIZE,
        TIM.SRNO,
        TIM.CDOCNAME,
        TIM.CDATE,
        TIM.USERID,
        TIM.NOTE,
        (SELECT CONCAT(FNAME," ",LNAME) FROM TUSER T WHERE T.USRID=TIM.USERID AND T.CLNT=TIM.CLNT AND T.LANG=TIM.LANG) AS USERNM 
    FROM TIMAGE TIM  
    WHERE TIM.CLNT=? 
        AND TIM.LANG=? 
        AND TIM.CENTITYID=?  
        AND TIM.CENTITY=? 
        AND TIM.ISDEL='N' 
    ORDER BY CDATE DESC, SRNO DESC


`;


// Query for get Uploaded Documents Details
export const getUploadedDocDetailsQuery = `
    SELECT 
        TIM.CLNT,
        TIM.LANG,
        TIM.CENTITY,
        TIM.CENTITYID,
        TIM.CIMGDOC,
        TIM.CDOCTYPE,
        TIM.CDOCDESC,
        TIM.CDOCEXTENSION,
        TIM.CDOCSIZE,
        TIM.SRNO,
        TIM.CDOCNAME,
        TIM.CDATE,
        TIM.USERID,
        TIM.NOTE
    FROM TIMAGE TIM  
    WHERE TIM.CLNT=? 
        AND TIM.LANG=? 
        AND TIM.CENTITYID=?  
        AND TIM.CENTITY=? 
        AND TIM.SRNO = ?
        AND TIM.ISDEL='N' 
    ORDER BY TIM.CDATE DESC
`;



// Query for Downloading Uploaded Documents
export const downloadUploadedDocumentsQuery = `
    SELECT CDOCNAME, CDOCTYPE, CDOCSIZE, CDOC 
    FROM TIMAGE 
    WHERE SRNO = ?
        AND ISDEL='N'
`;


// Query for checking duplicate contacts
export const checkDuplicateContactsQuery = `
    SELECT COUNT(*) COUNT 
    FROM TCONTACTS 
    WHERE CLNT=? 
        AND LANG=? 
        AND CONTACTID=?
`;


// Query for checking duplicate contacts using email id
export const checkDuplicateContactsEmailQuery = `
    SELECT COUNT(*) COUNT 
    FROM TCONTACTS 
    WHERE CLNT=? 
        AND LANG=? 
        AND EMAILID=?
`;


// Query for ddl Contact types
export const contactTypesDDLQuery = `
    SELECT 'Select' AS "CODE", 'Select' AS "DESC" UNION
    SELECT 'Customer', 'Customer'  UNION
    SELECT 'Lead', 'Lead'  UNION
    SELECT 'Personal', 'Personal'
`;


// Query for checking duplicate customers
export const checkDuplicateCustomersQuery = `
    SELECT COUNT(*) COUNT 
    FROM MCUST 
    WHERE CLNT=? 
        AND LANG=? 
        AND CCODE=? 
        AND ISDEL='N'
`;


// Query for checking duplicate customers using Email
export const checkDuplicateCustomersEmailQuery = `
    SELECT COUNT(*) COUNT 
    FROM MCUST 
    WHERE CLNT=? 
        AND LANG=? 
        AND UPPER(TRIM(CMAIL)) = UPPER(TRIM(?))
`;


// Query for ddl States
export const statesDDLQuery = `
    SELECT STCODE AS "CODE", STDESC AS "DESC"
    FROM STATENM 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N' 
    ORDER BY STDESC
`;

// Query for ddl Country
export const countriesDDLQuery = `
    SELECT CID AS "CODE", CNAME AS "DESC"
    FROM MCOUNTRY1 
    WHERE CLNT = ? 
        and LANG = ?
        and ISDEL = 'N'
    ORDER BY  CNAME ASC  
`;



// Query for ddl Tax Types 
export const taxTypesDDLQuery = `
    SELECT  DISTINCT TAXCD AS "CODE", 
            TAXDESC AS "DESC"
    FROM TAXCODE 
    WHERE CLNT=? 
        AND LANG=?  
    ORDER BY TAXDESC		
`;


// Query for Searching Tax Rates
export const searchTaxRatesQuery = `
    SELECT * 
    FROM MTAXRATE 
    WHERE CLNT=? 
        AND LANG=? 
        AND DOCTYPE=? 
        AND ISDEL='N'  
    ORDER BY CORDER
`;



// Query for ddl Task and Invoice Status
export const taskInvoiceStatusDDLQuery = `
    SELECT DISTINCT STATUSID AS "CODE", STATUS AS "DESC" 
    FROM T_TASKSTATUS 
    WHERE CLNT=? 
        AND LANG=? 
        AND STATUSFOR=? 
        AND ISDEL='N' 
    ORDER BY STATUS ASC
`;


// Query for ddl Task Priority
export const taskPriorityDDLQuery = `
    SELECT DISTINCT PRIORITYID AS "CODE", PRIORITY AS "DESC" 
    FROM T_TASKPRIORITY 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N' 
    ORDER BY PRIORITY ASC
`;


// Query for checking duplicate documents
export const checkDuplicateDocumentsQuery = `
    SELECT COUNT(*) COUNT 
    FROM TDOCHDR 
    WHERE CLNT=? 
        AND LANG=? 
        AND DOCID=?
`;

// Query for checking duplicate documents line items
export const checkDuplicateDocumentItemsQuery = `
    SELECT COUNT(*) COUNT 
    FROM TDOCDTL 
    WHERE CLNT=? 
        AND LANG=? 
        AND DOCID=?
        AND LINEITEMNO=?
`;



// Query for checking duplicate Tax Amounts
export const checkDuplicateTaxAmountQuery = `
    SELECT COUNT(*) COUNT 
    FROM TTAXAMOUNT 
    WHERE CLNT=? 
        AND LANG=? 
        AND DOCID=?
`;


// Query for ddl Customers
export const customersDDLQuery = `
    SELECT  CCODE AS "CODE", CONCAT_WS('-', CNAME, CMAIL)  AS "DESC" 
    FROM MCUST 
    WHERE
        CLNT=? AND
        LANG=? AND 
        ISDEL='N'
    order by CNAME
`;


// Query for ddl Currency
export const currencyDDLQuery = `
    SELECT DISTINCT CURCD AS "CODE", CURDESC AS "DESC" 
    FROM TCURRENCY 
    WHERE CLNT=? 
        AND LANG=?
        AND ISDEL='N' 
    ORDER BY CURDESC
`;

// Query for checking duplicate services
export const checkDuplicateServiceQuery = `
    SELECT COUNT(*) COUNT 
    FROM SERVTYP 
    WHERE CLNT=? 
        AND LANG=? 
        AND CATCODE = ?
        AND STCODE =? 
        AND ISDEL='N'
`;


// Query for Searching services
export const searchServicesQuery = `
    SELECT * 
    FROM SERVTYP 
    WHERE CLNT=? 
        AND LANG=? 
        AND UPPER(STDESC) LIKE UPPER(?) 
        AND ISDEL='N' 
    ORDER BY CAST( ORDERNO AS SIGNED INTEGER ) DESC
`;


// Query for gettings service details
export const getServiceDetailsQuery = `
    SELECT * 
    FROM SERVTYP 
    WHERE CLNT=? 
        AND LANG=? 
        AND CATCODE = ?
        AND STCODE=? 
        AND ISDEL='N'
`;


// Query for ddl Service Category
export const serviceCategoryDDLQuery = `
    SELECT CATCODE AS "CODE", CATDESC AS "DESC" 
    FROM SERVCAT
    WHERE ISDEL = 'N'
    AND CATCODE != '00'
    ORDER  BY CATDESC ASC;
`;


// Query for ddl Business Types
export const businessTypesDDLQuery = `
    SELECT DISTINCT BUSINESSCD AS "CODE", BUSINESSNM AS "DESC" 
    FROM TBUSINESSTYPE 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N' 
    ORDER BY BUSINESSNM ASC
`;


// Query for gettings case details
export const getCaseDetailsQuery = `
    SELECT *
    FROM CASEDETAILS 
    WHERE CLNT = ?
        AND LANG = ?
        AND CIDSYS = ?
`;


// Query for ddl Payment Mode
export const paymentModeDDLQuery = `
    SELECT DISTINCT PAYMENTBYCD AS "CODE", PAYMENTBYDSC AS "DESC"
    FROM PAYMENTBY 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N' 
    ORDER BY PAYMENTBYDSC
`;

// Query for Searching Authorizations
export const searchAuthorizationsQuery = `
    SELECT TU.GRPID,TU.GRPNM,
        CASE WHEN ( 
            SELECT count(*) COUNTAGGR 
            FROM TGPUSR TG
            WHERE TG.CLNT=? 
                AND TG.LANG=? 
                AND TG.USRID=?         
                AND  TG.GRPID=TU.GRPID AND TG.ISDEL='N'
            ) > 0 THEN 'true' 
        ELSE 'false' END AS GDESC
    FROM TUSRGRP TU
    WHERE TU.CLNT=? 
        AND TU.LANG=? 
        AND TU.ISDEL='N'
        AND TU.GRPID IN (SELECT GRPID FROM TUSRGRP WHERE GRPID IN ('EXUSRS','EXINV'))        
    ORDER BY TU.GRPNM
`;


// Query for ddl Company
export const companyDDLQuery = `
    SELECT CMPN AS "CODE", CNAME AS "DESC" 
    FROM MCMPN 
    WHERE CLNT='1002' 
        AND LANG='EN' 
        AND ISDEL='N' 
        AND ISCURACTIVE ='Y'
`;


// Query for checking duplicate reminders
export const checkDuplicateReminderQuery = `
    SELECT COUNT(*) COUNT
    FROM TREMAINDER 
    WHERE CLNT=? 
        AND LANG=? 
        AND REMNO=? 
        AND ISDEL='N'
`;

// Query for getting invoice details for reminder
export const getInvoiceForReminderQuery = `
    SELECT H.*, C.CMAIL COMPMAIL, V.CMAIL CUSTMAIL
    FROM TDOCHDR H, MCMPN C, MCUST V  
    WHERE H.CLNT=C.CLNT
    	and H.LANG=C.LANG
    	AND H.CLNT=V.CLNT
    	and H.LANG=V.LANG
        and C.CMPN = H.CMPN        
        and V.CCODE = H.CUSTCD
		and H.CLNT=? 
        AND H.LANG=? 
        AND H.DOCID=?
        AND V.ISDEL = 'N'
        AND C.ISDEL='N'
        AND H.ISDEL='N'
`;


// Query for getting document header
export const documentHeaderQuery = `
    SELECT * 
    FROM  TDOCHDR 
    WHERE CLNT=? 
        AND LANG=? 
        AND DOCID=?
`;


// Query for getting document details
export const documentDetailsQuery = `
    SELECT  *
    FROM   TDOCDTL
    WHERE  CLNT=? 
            AND LANG=? 
            AND DOCID=?
`;


// Query for getting tax details
export const taxDetailsQuery = `
    SELECT * 
    FROM TTAXAMOUNT 
    WHERE CLNT=? 
        AND LANG=? 
        AND DOCID=? 
        ORDER BY CORDER
`;


// Query for gettings contract details
export const getContractDetailsQuery = `
    SELECT * 
    FROM TCONTRACTCOM 
    WHERE CLNT=? 
        AND LANG=? 
        AND	CIDSYS=?
`;


// Query for checking duplicate contracts
export const checkDuplicateContractsQuery = `
    SELECT COUNT(*) COUNT 
    FROM TCONTRACTCOM 
    WHERE CLNT=? 
        AND LANG=? 
        AND	CIDSYS=?        
`;


// Query for gettings eCheck Authorization details
export const getECheckAuthorizationDetailsQuery = `
    SELECT * 
    FROM ECHECKAUTH  
    WHERE CLNT=? 
        AND LANG=?  
        AND CIDSYS=? 
`;


// Query for gettings Card Authorization details
export const getCardAuthorizationDetailsQuery = `
    SELECT * 
    FROM CARDAUTH  
    WHERE CLNT=? 
        AND LANG=?  
        AND CIDSYS=? 
`;


// Query for gettings Cash Authorization details
export const getCashAuthorizationDetailsQuery = `
    SELECT * 
    FROM CASHOTHERPAYMENT  
    WHERE CLNT=? 
        AND LANG=?  
        AND CIDSYS=? 
`;



// Query for checking Duplicate eCheck Authorizations
export const checkDuplicateECheckAuthorizationQuery = `
    SELECT COUNT(*) COUNT 
    FROM ECHECKAUTH  
    WHERE CLNT=? 
        AND LANG=?  
        AND CIDSYS=? 
`;


// Query for checking Duplicate Card Authorizations
export const checkDuplicateCardAuthorizationQuery = `
    SELECT COUNT(*) COUNT 
    FROM CARDAUTH  
    WHERE CLNT=? 
        AND LANG=?  
        AND CIDSYS=? 
`;


// Query for checking Duplicate Cash Authorizations
export const checkDuplicateCashAuthorizationQuery = `
    SELECT COUNT(*) COUNT 
    FROM CASHOTHERPAYMENT  
    WHERE CLNT=? 
        AND LANG=?  
        AND CIDSYS=? 
`;


// Query for ddl Part Master
export const partMasterDDLQuery = `
    SELECT DISTINCT MPARTNO AS "CODE",  MDESC AS "DESC" 
    FROM MPART 
    WHERE CLNT = ?
        AND LANG = ?
        AND ISDEL = 'N'
    ORDER BY MDESC ASC
`;


// Query for ddl Card Type in Cases Authorization
export const cardTypeDDLQuery = `
    SELECT DISTINCT CARDCD AS "CODE",  CARDDESC AS "DESC" 
    FROM CARDTYPE 
    WHERE CLNT = ?
        AND LANG = ?
        AND ISDEL = 'N'
    ORDER BY CARDDESC ASC
`;


// Query for ddl Payment For in Cases Authorization
export const payForDDLQuery = `
    SELECT 'Select' AS "CODE", 'Select' AS "DESC" UNION
    SELECT 'AdvancePayment', 'Advance Payment'  UNION
    SELECT 'Retainer', 'Retainer' 
`;

// Query for ddl Payment Mode in Cases Authorization
export const payModeDDLQuery = `
    SELECT 'Select' AS "CODE", 'Select' AS "DESC" UNION
    SELECT 'Cash', 'Cash'  UNION
    SELECT 'Other', 'Other' 
`;


// Query for getting contract templates
export const getContractTemplateQuery = `
    SELECT * 
    FROM TCUSTOMCONTRACT 
    WHERE CLNT=? 
        AND LANG=? 
        AND UPPER(TRIM(SERVICETYPE))=UPPER(TRIM(?))
        AND ISDEL ='N'
`;


// Query for Searching Progress Reports
export const searchProgressReportsQuery = `
    SELECT  PRGRPT.CLNT,PRGRPT.LANG,PRGRPT.PRGRPTID,PRGRPT.PRGWORKID,PRGRPT.CDATE ,PRGRPT.RPTTXT,PRGRPT.SHAREWITH,
            PRGRPT.WORKCAT,PRGRPT.WORKHOURS,PRGRPT.CDOCTYPE,PRGRPT.CDOCDESC,PRGRPT.DOCNM,
            (SELECT T.USRNM FROM TUSER T WHERE T.USRID=PRGRPT.CUSER AND T.CLNT=PRGRPT.CLNT AND T.LANG=PRGRPT.LANG) AS CUSER,
            PRGRPT.DOCID, PRGRPT.CIDSYS
    FROM TPROGRESSWORK PRGRPT 
    WHERE CLNT=? AND LANG=? 
        AND UPPER(PRGRPT.PRGRPTID) LIKE UPPER(?) 
        AND COALESCE(UPPER(PRGRPT.CUSER),'%') LIKE UPPER(?) 
        AND UPPER(PRGRPT.RPTTXT) LIKE UPPER(?)
        AND PRGRPT.CDATE BETWEEN ? AND ?
        AND PRGRPT.CIDSYS =?
        AND ISDEL='N' 
    ORDER BY PRGRPT.PRGRPTID
`;



// Query for gettings progress report details
export const getProgressReportDetailsQuery = `
    SELECT * 
    FROM TPROGRESSWORK  
    WHERE CLNT=? 
        AND LANG=?  
        AND PRGRPTID=?  
        AND ISDEL='N'
`;


// Query for checking duplicate progress reports
export const checkDuplicateProgressReportsQuery = `
    SELECT COUNT(*) COUNT 
    FROM TPROGRESSWORK 
    WHERE CLNT=? 
        AND LANG=? 
        AND PRGRPTID=? 
        AND PRGWORKID=? 
        AND ISDEL='N'
`;

// Query for ddl Work Category
export const workCategoryDDLQuery = `
    SELECT DISTINCT CATCD AS "CODE", CATDESC AS "DESC" 
    FROM TWORKCAT 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N'
    ORDER BY CATDESC
`;


// Query for Downloading Progress Report Documents
export const downloadProgressReportDocumentsQuery = `
    SELECT  DOCNM AS CDOCNAME, CEXTENSION AS CDOCTYPE, OCTET_LENGTH(CDOC) AS CDOCSIZE, CDOC
    FROM TPROGRESSWORK
    WHERE TRIM(PRGWORKID) = TRIM(?)
`;


// Query for Downloading Progress Report Zip
export const downloadProgressReportZipQuery = `
    SELECT  DOCNM AS CDOCNAME, CEXTENSION AS CDOCTYPE, OCTET_LENGTH(CDOC) AS CDOCSIZE, CDOC
    FROM TPROGRESSWORK
    WHERE TRIM(CIDSYS) = TRIM(?)
`;


// Query for ddl Task Of
export const taskOfDDLQuery = `
    SELECT DISTINCT TASKOF AS "CODE", TASKOF AS "DESC"
    FROM T_TASKS 
    WHERE (TASKOF IS NOT NULL OR TASKOF != NULL)
    ORDER BY TASKOF ASC
`;


// Query for ddl Excel Document Types
export const excelDocTypesDDLQuery = `
    SELECT DISTINCT DTYPR AS "CODE", DTYPR AS "DESC" 
    FROM EXCELDOCTYPE 
    WHERE CLNT=? 
        AND LANG=? 
        AND ISDEL='N' 
    ORDER BY DTYPR
`;


// Query for Downloading Company Document - Price List
export const downloadPriceListQuery = `
    SELECT DOCNM AS CDOCNAME, DOCEXTENSION AS CDOCTYPE, OCTET_LENGTH(DOCUMENT) AS CDOCSIZE, DOCUMENT AS CDOC
    FROM EXCELDOCUMENT
    WHERE UPPER(TRIM(DOCTYPE)) = 'PRICE LIST'
`;


// Query for Downloading Company Document - Company Profile
export const downloadCompanyProfileQuery = `
    SELECT DOCNM AS CDOCNAME, DOCEXTENSION AS CDOCTYPE, OCTET_LENGTH(DOCUMENT) AS CDOCSIZE, DOCUMENT AS CDOC
    FROM EXCELDOCUMENT
    WHERE UPPER(TRIM(DOCTYPE)) = 'COMPANY PROFILE'
`;


// Query for checking duplicate Company Documents
export const checkDuplicateCompanyDocsQuery = `
    SELECT COUNT(*) COUNT 
    FROM EXCELDOCUMENT 
    WHERE CLNT = ? 
        AND LANG = ? 
        AND UPPER(TRIM(DOCTYPE)) = UPPER(TRIM(?))
`;


//-------- Code by Kedar Starts ----------
export const eSignatureQuery = `
    SELECT * FROM SIGNATURE 
    WHERE CLNT= ?
    AND LANG = ?
     AND UPPER(SIGNATUREID) LIKE UPPER(?)
     AND UPPER(CID) LIKE UPPER(?)
     AND UPPER(CIDSYS) LIKE UPPER(?)
`;


// Query for Searching Rate Card for any match
export const searchRatecardQuery = `
    SELECT
        *
    FROM
        EXRATECARD RATECD
    WHERE
    RATECD.CLNT = ? 
        AND RATECD.LANG = ? 
        AND UPPER(RATECD.CLIENTID) LIKE UPPER(?)
        AND UPPER(RATECD.CIDSYS) LIKE UPPER(?)
        AND UPPER(RATECD.ITEMID) LIKE UPPER(?)
        AND UPPER(RATECD.ITEMDECS) LIKE UPPER(?)
        AND UPPER(RATECD.ISACTIVE) LIKE UPPER(?)
        AND RATECD.ISDEL = 'N'
    ORDER BY RATECD.ITEMDECS 
`;

// Query for checking duplicate Rate Card
export const checkDuplicateRatecardQuery = `
    SELECT COUNT(*) COUNT 
    FROM EXRATECARD 
    WHERE CLNT=?
        AND LANG=?
        AND CLIENTID=?
        AND CIDSYS=?
        AND ITEMID=?
`;

// Query for gettings Ratecard details
export const getRatecardDetailsQuery = `
    SELECT *  
    FROM EXRATECARD RATECD 
    WHERE RATECD.CLNT=? 
        AND RATECD.LANG=?  
        AND RATECD.CLIENTID LIKE TRIM(?)
        AND RATECD.CIDSYS LIKE TRIM(?)
        AND RATECD.ITEMID LIKE TRIM(?)
        AND RATECD.ISDEL='N'`;

//Query for getting ratecard for client
export const getRatecardForClientQuery =`
SELECT *  
    FROM EXRATECARD RATECD 
    WHERE RATECD.CLNT=? 
        AND RATECD.LANG=?  
        AND RATECD.CLIENTID LIKE TRIM(?)
        AND RATECD.CIDSYS LIKE TRIM(?)
        AND RATECD.ISDEL='N'`;

        

export const exportRateCardQuery=`
SELECT
			"Client Id",
            "Case Id",
            "Service Id",
            "Service",
			"Rate",
			"Is Active"
            
    UNION

    SELECT * FROM 
    (

        SELECT
            CLIENTID AS "Client Id",
            CIDSYS AS "Case Id",
            ITEMID AS "Service Id",
            ITEMDECS AS "Service",
			ITEMRATE AS "Rate",
			ISACTIVE AS "Is Active"
        FROM
            EXRATECARD
        WHERE
            CLNT = ? 
            AND LANG = ? 
			AND CLIENTID = ?
			AND CIDSYS = ?
			AND ITEMID LIKE ? 
            AND UPPER(ITEMDECS) LIKE UPPER(?) 
            AND ISDEL = 'N'
        ORDER BY CAST( ITEMID AS SIGNED INTEGER ) 

    ) TAB
`; 

// Query for checking duplicate Rate Card
export const checkDuplicateRatecardForClientQuery = `
    SELECT COUNT(*) COUNT 
    FROM EXRATECARD 
    WHERE CLNT=?
        AND LANG=?
        AND CLIENTID=?
`;

//-------- Code by Kedar Ends ----------


/**
 *  Section 2 : Queries for Export to Excel
 *  Structure : Column Headers UNION Select Query
 */


// Query for Exporting Admin Leads List to Excel
export const exportAdminLeadsQuery = `
    SELECT 
        "Date",
        "Client Name",
        "Business Name",
        "Phone",
        "Email-Id",
        "Source",
        "Assigned To",
        "Service Type",
        "Status",
        "Contact Method"

    UNION

    SELECT * FROM 
    (

        SELECT 
            DATE_FORMAT (CONVERT( TINQ.CDATE ,DATE  ),'%d-%b-%Y') AS "Date",
            TINQ.FULLNM AS "Client Name",
            TINQ.OFFICENM AS "Business Name",
            TINQ.PHONE  AS "Phone",
            TINQ.EMAILID AS "Email-Id",
            TINQ.CSOURCE "Source",
            U.USRNM AS "Assigned To",
            S.STDESC AS "Service Type",
            J.STATDSC AS "Status",
            MODDESC AS "Contact Method"
        FROM EXLEADS TINQ 
        LEFT OUTER JOIN  TUSER U ON  TINQ.ASSIGNTO= U.USRID AND TINQ.CLNT=U.CLNT
        LEFT OUTER JOIN  SERVTYP S ON TINQ.TYPSERV=S.STCODE
        LEFT OUTER JOIN  MJOBSTAT J ON TINQ.STATUS=J.STATCD
        LEFT OUTER JOIN  PREFMODCON C ON TINQ.MODOFCON=C.MODCODE
        WHERE  TINQ.CLNT=?
            AND TINQ.LANG=?
            AND (
                UPPER(coalesce(TINQ.FULLNM,'X')) LIKE UPPER(?)
                AND UPPER(coalesce(TINQ.OFFICENM,'X')) LIKE UPPER(?)
                AND UPPER(coalesce(TINQ.PHONE,'X')) LIKE UPPER(?)
                AND UPPER(coalesce(TINQ.EMAILID,'X')) LIKE UPPER(?)
                AND UPPER(coalesce(TINQ.TYPSERV,'X')) LIKE UPPER(?)
                AND UPPER(COALESCE(TINQ.STATUS, 'X')) LIKE UPPER(?)
                AND UPPER(COALESCE(TINQ.CATCODE, 'X')) LIKE UPPER(?)
            )
            AND TINQ.ISDEL='N'
        ORDER BY TINQ.CDATE DESC,TINQ.FRSTNM DESC,TINQ.OFFICENM DESC

    ) TAB

`;


// Query for Exporting Contacts List to Excel
export const exportContactsQuery = `
    SELECT
        'First Name',
        'Last Name',
        'Display Name',
        'Email',
        'Phone',
        'Business Name',
        'Contact Type'

    UNION

    SELECT * FROM 
    (

        SELECT
            TCONT.FRSTNM AS 'First Name',
            TCONT.LSTNM AS 'Last Name',
            TCONT.DISNAME AS 'Display Name',
            TCONT.EMAILID AS 'Email',
            TCONT.PHONE AS 'Phone',
            TCONT.COMPANY AS 'Business Name',
            TCONT.CONTACTTYPE AS 'Contact Type'
        FROM
            TCONTACTS TCONT
        WHERE
            TCONT.CLNT = ? 
            AND TCONT.LANG = ? 
            AND (
                UPPER(COALESCE(TCONT.DISNAME, 'X')) LIKE UPPER(?) 
                AND UPPER(COALESCE(TCONT.COMPANY, 'X')) LIKE UPPER(?) 
                AND UPPER(COALESCE(TCONT.PHONE, 'X')) LIKE UPPER(?) 
                AND UPPER(COALESCE(TCONT.EMAILID, 'X')) LIKE UPPER(?)
            ) 
            AND TCONT.ISDEL = 'N'
        ORDER BY
            TCONT.DISNAME,
            TCONT.COMPANY

    ) TAB
`;


// Query for Exporting Customers List to Excel
export const exportCustomersQuery = `
    SELECT
        "Customer Code",
        "First Name",
        "Last Name",
        "EMail ID",
        "Phone No",
        "Business or Law Office",
        "Address",
        "City",
        "Pin Code",
        "Fax No",
        "State",
        "Best Time To call",
        "Best Method Of Contact",
        "Country"

    UNION

    SELECT * FROM 
    (

        SELECT CDTL.CCODE AS "Customer Code",
                CDTL.FIRSTNM AS "First Name",
                CDTL.LASTNM AS "Last Name",
                CDTL.CMAIL AS "EMail ID",
                CDTL.PHNO AS "Phone No",
                CDTL.OFFICENM AS "Business or Law Office",
                CDTL.ADDR AS "Address",
                CDTL.CITY AS "City",
                CDTL.PINC AS "Pin Code",
                CDTL.FAXNO AS "Fax No",
                (SELECT STDESC FROM STATENM WHERE CLNT=CDTL.CLNT AND LANG=CDTL.LANG AND STCODE=CDTL.STATE) AS  "State", 
                (SELECT TDESC FROM BESTTMCAL WHERE CLNT=CDTL.CLNT AND LANG=CDTL.LANG AND TCODE=CDTL.BESTTMCAL) AS  "Best Time To call", 
                (SELECT MODDESC FROM PREFMODCON WHERE CLNT=CDTL.CLNT AND LANG=CDTL.LANG AND MODCODE=CDTL.MODOFCON) AS  "Best Method Of Contact",
                (SELECT CNAME FROM MCOUNTRY1 WHERE CLNT=CDTL.CLNT AND LANG=CDTL.LANG AND CID=CDTL.COUNTRY) AS  "Country"
        FROM MCUST CDTL 
        WHERE CDTL.CLNT=? 
                AND CDTL.LANG=? 
                AND UPPER(CDTL.FIRSTNM) LIKE UPPER(?) 
                AND UPPER(CDTL.LASTNM) LIKE UPPER(?)
                AND UPPER(CDTL.CMAIL) LIKE UPPER(?) 
                AND COALESCE(UPPER(CDTL.CELLNO),'%') LIKE UPPER(?)
                AND CDTL.ISDEL='N' 
        ORDER BY CDTL.FIRSTNM,CDTL.LASTNM,CDTL.OFFICENM

    ) TAB
`;


// Query for Exporting Admin Cases List to Excel
export const exportAdminCasesQuery = `
    SELECT
        "Client",
        "Lang",
        "Client ID",
        "First Name",
        "Last Name",
        "Business Or Low Office",
        "Email",
        "Phone",
        "Case Id",
        "Case Details",
        "File Number",
        "Case Type",
        "Case Date",
        "Court Name"

    UNION

    SELECT * FROM 
    (

        SELECT * FROM 
        (
            SELECT CLD.CLNT,CLD.LANG,
                CLD.CLNTID AS "CLINT ID",
                CLD.FIRSTNM AS "FIRSTNAME",
                CLD.LASTNM AS "LASTNAME",
                CLD.OFFICENM AS "BUSINESS OR LOW OFFICE",
                CLD.EMAILID AS "EMAIL",
                CLD.PHONE AS "PHONE",
                CSD.CID AS "CASE ID",
                CSD.CASETL AS "CASE DETAIL",
                CSD.FILENO AS "FILE NUMBER",
                CSD.TYPE AS "CASE TYPE",
                CSD.CASEDT AS "CASE DATE",
                CSD.COURTNM AS "COURT NAME" 
            FROM CLIENTDETAILS CLD
            LEFT JOIN CASEDETAILS CSD ON CLD.CLNTID = CSD.CLIENTID
                AND CLD.ISDEL =  'N'
                AND CSD.ISDEL =  'N'
                AND CSD.ISCLOSED='N'
            LEFT JOIN STATENM ST ON CLD.STATE = ST.STCODE
            LEFT JOIN BESTTMCAL BT ON CLD.BESTTMCAL = BT.TCODE
            LEFT JOIN PREFMODCON MDC ON CLD.MODOFCON = MDC.MODCODE
            ORDER BY  CLD.FIRSTNM
        ) AS T 
        WHERE
            T.CLNT=? 
            AND T.LANG=? 
            AND UPPER(T.FIRSTNAME) LIKE  UPPER(?) 
            AND  UPPER(T.LASTNAME) LIKE  UPPER(?)
            AND  UPPER(T.EMAIL) LIKE  UPPER(?) 
            AND  UPPER(T.PHONE) LIKE  UPPER(?)
        ORDER BY T.FIRSTNAME,T.LASTNAME

    ) TAB
`;


// Query for Exporting Progress Report List to Excel
export const exportProgressReportQuery = `
    SELECT
        "Case ID",
        "Progress Report ID",
        "Report Date",
        "Details",
        "Share With Customer",
        "User"

    UNION

    SELECT * FROM 
    (

        SELECT  PRGRPT.CIDSYS,
                PRGRPT.PRGRPTID,
                DATE_FORMAT (CONVERT(PRGRPT.CDATE, DATE ),'%d-%b-%Y') RPTDATE,
                PRGRPT.RPTTXT,
                PRGRPT.SHAREWITH,
                (SELECT T.USRNM FROM TUSER T WHERE T.USRID=PRGRPT.CUSER AND T.CLNT=PRGRPT.CLNT AND T.LANG=PRGRPT.LANG) AS CUSER            
        FROM TPROGRESSWORK PRGRPT 
        WHERE CLNT=? AND LANG=? 
            AND UPPER(PRGRPT.PRGRPTID) LIKE UPPER(?) 
            AND COALESCE(UPPER(PRGRPT.CUSER),'%') LIKE UPPER(?) 
            AND UPPER(PRGRPT.RPTTXT) LIKE UPPER(?)
            AND PRGRPT.CDATE BETWEEN ? AND ?
            AND PRGRPT.CIDSYS =?
            AND ISDEL='N' 
        ORDER BY PRGRPT.PRGRPTID

    ) TAB

`;


// Query for Exporting Invoice List to Excel
export const exportInvoicesQuery = `
    SELECT
        'Invoice Number',
        'Invoice Date',
        'Due Date',
        'Customer',
        'Amount Due',
        'Total',
        'Header',
        'Remarks',
        'Status'

    UNION

    SELECT * FROM 
    (
            SELECT  HDR.DOCNO AS 'Invoice Number',
                    DATE_FORMAT(
                        CONVERT(HDR.DOCDT, DATE),
                        '%d-%b-%Y'
                    ) AS 'DATE',
                    DATE_FORMAT(
                        CONVERT(HDR.DUEDT, DATE),
                        '%d-%b-%Y'
                    ) AS 'Due Date',
                    HDR.CUSTOMER AS 'Customer',
                    HDR.BAL AS 'Amount Due',
                    HDR.TOT AS 'Total',
                    HDR.DOCHDR AS 'Header',
                    HDR.RMKS AS 'Remarks',
                    STS.STATUS AS 'Status'
            FROM    TDOCHDR HDR, 
                    T_TASKSTATUS STS  
            WHERE 
                    HDR.CLNT=STS.CLNT 
                    AND HDR.LANG=STS.LANG
                    AND HDR.STATUS=STS.STATUSID 
                    AND	HDR.CLNT=? 
                    AND HDR.LANG=? 
                    AND HDR.ISDEL='N' 
                    AND HDR.DOCTYPE=? 
                    AND UPPER(HDR.DOCNO) LIKE UPPER(?)
                    AND UPPER(HDR.CUSTOMER) LIKE UPPER(?)
                    AND UPPER(HDR.CMPNNM) LIKE UPPER(?)
                    AND UPPER(HDR.CIDSYS) LIKE UPPER(?)
                    AND HDR.DOCDT BETWEEN ? AND ? 
                    AND STS.STATUSFOR='INVOICE' 
                    AND HDR.DOCNO IS NOT NULL AND HDR.DOCNO !=''

    ) TAB
`;

// Query for Exporting Admin Task List to Excel
export const exportAdminTasksQuery = `
    SELECT
        'Task ID',
        'Subject',
        'Priority',
        'Assigned To',
        'Assign By',
        'Due Date',
        'Status',
        'Task Of',
        'Case/Lead ID'

    UNION

    SELECT * FROM 
    (

        SELECT  
            T.TASKID,
            T.SUBJECT,
            P.PRIORITY PRIORITY,
            U.USRNM TASKFOR,
            O.USRNM TASKOWNER,
            DATE_FORMAT( STR_TO_DATE(T.DUEDATE, '%Y%m%d'), '%m/%d/%Y' ),
            S.STATUS STATUS,
            T.TASKOF,
            T.TASKOFID
        FROM    T_TASKS T
        LEFT OUTER JOIN TUSER U 
        ON T.TASKFOR = U.USRID
            AND T.CLNT = U.CLNT
            AND T.LANG = U.LANG
        LEFT OUTER JOIN TUSER O
        ON T.TASKOWNER = O.USRID
            AND T.CLNT = O.CLNT
            AND T.LANG = O.LANG
        LEFT OUTER JOIN T_TASKSTATUS S
        ON T.STATUSID = S.STATUSID
            AND T.CLNT = S.CLNT
            AND T.LANG = S.LANG
            AND S.STATUSFOR = 'TASK'
        LEFT OUTER JOIN T_TASKPRIORITY P
        ON T.PRIORITYID = P.PRIORITYID
            AND T.CLNT = P.CLNT
            AND T.LANG = P.LANG
        WHERE   T.CLNT=?
            AND T.LANG=?
            AND COALESCE(UPPER(T.STATUSID),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(T.SUBJECT),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(U.USRID),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(T.PRIORITYID),'%') LIKE UPPER(?)
            AND T.DUEDATE BETWEEN ? AND ?
            AND COALESCE(UPPER(T.TASKOF),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(T.TASKOFID),'%') LIKE UPPER(?)
            AND T.ISDEL='N' 
        ORDER BY CAST(T.TASKID AS INT) DESC

    ) TAB
`;



// Query for Exporting Logged-in User Task List to Excel
export const exportUserTasksQuery = `
    SELECT
        'Task ID',
        'Subject',
        'Priority',
        'Assigned To',
        'Assign By',
        'Due Date',
        'Status',
        'Task Of',
        'Case/Lead ID'

    UNION

    SELECT * FROM 
    (

        SELECT  
            T.TASKID,
            T.SUBJECT,
            P.PRIORITY PRIORITY,
            U.USRNM TASKFOR,
            O.USRNM TASKOWNER,
            DATE_FORMAT( STR_TO_DATE(T.DUEDATE, '%Y%m%d'), '%m/%d/%Y' ),
            S.STATUS STATUS,
            T.TASKOF,
            T.TASKOFID
        FROM    T_TASKS T
        LEFT OUTER JOIN TUSER U 
        ON T.TASKFOR = U.USRID
            AND T.CLNT = U.CLNT
            AND T.LANG = U.LANG
        LEFT OUTER JOIN TUSER O
        ON T.TASKOWNER = O.USRID
            AND T.CLNT = O.CLNT
            AND T.LANG = O.LANG
        LEFT OUTER JOIN T_TASKSTATUS S
        ON T.STATUSID = S.STATUSID
            AND T.CLNT = S.CLNT
            AND T.LANG = S.LANG
            AND S.STATUSFOR = 'TASK'
        LEFT OUTER JOIN T_TASKPRIORITY P
        ON T.PRIORITYID = P.PRIORITYID
            AND T.CLNT = P.CLNT
            AND T.LANG = P.LANG
        WHERE   T.CLNT=?
            AND T.LANG=?  
            AND T.ISDEL='N' 
            AND UPPER(T.TASKFOR) = UPPER(?)
            AND COALESCE(UPPER(T.STATUSID),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(T.SUBJECT),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(O.USRID),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(T.PRIORITYID),'%') LIKE UPPER(?)
            AND T.DUEDATE BETWEEN ? AND ?
            AND COALESCE(UPPER(T.TASKOF),'%') LIKE UPPER(?)
            AND COALESCE(UPPER(T.TASKOFID),'%') LIKE UPPER(?)
        ORDER BY CAST(T.TASKID AS INT) DESC
        
    ) TAB

`;

// Query for Exporting User List to Excel
export const exportUsersQuery = `
    SELECT
        "First Name",
        "Last Name",
        "User Id",
        "Display Name",
        "Gender",
        "Email",
        "Phone",
        "Mobile",
        "Address",
        "City",
        "Country",
        "Pin Code"

    UNION

    SELECT * FROM 
    (

        SELECT TUSR.FNAME as "First Name",TUSR.LNAME as "Last Name",TUSR.USRID as "User Id",
            TUSR.USRNM as "Display Name",TUSR.USEX as "Gender",
            TUSR.UMAIL as "Email",TUSR.PHNO as "Phone",
            TUSR.CELLNO as "Mobile",TUSR.ADDR as "Address",
            TUSR.CITY as "City",CNTRY.CNAME as "Country",TUSR.PINC as "Pin Code"
        FROM TUSER TUSR,
            MCOUNTRY1 CNTRY
        WHERE
            TUSR.CLNT=CNTRY.CLNT AND
            TUSR.LANG=CNTRY.LANG AND
            TUSR.COUNTRY=CNTRY.CID AND
            TUSR.CLNT=? AND
            TUSR.LANG=? AND	
            (UPPER(TUSR.USRID) LIKE UPPER(?)) AND
            (UPPER(TUSR.USRNM) LIKE UPPER(?)) AND
            (UPPER(TUSR.UMAIL) LIKE UPPER(?)) AND
            (UPPER(TUSR.CELLNO) LIKE UPPER(?)) AND
            TUSR.ISDEL='N' 
        order by UPPER(TRIM(TUSR.FNAME)) ASC

    ) TAB
`;


// Query for Exporting Service List to Excel
export const exportServicesQuery = `
    SELECT
        "Service Code",
        "Service Name",
        "Order No.",
        "Is Active"
            
    UNION

    SELECT * FROM 
    (

        SELECT
            STCODE AS "Service Code",
            STDESC AS "Service Name",
            ORDERNO AS "Order No.",
            ISACTIVE AS "Is Active"
        FROM
            SERVTYP
        WHERE
            CLNT = ? 
            AND LANG = ? 
            AND UPPER(STDESC) LIKE UPPER(?) 
            AND ISDEL = 'N'
        ORDER BY CAST( ORDERNO AS SIGNED INTEGER ) DESC

    ) TAB
`;


// Query for Exporting Billed Hours Header to Excel
/* export const exportBilledHoursHeaderQuery = `
    SELECT
        "Client Id",
        "Client Name",
        "Billable Hours",
        "Billed Hours"
            
    UNION

    SELECT * FROM 
    (

        SELECT 
            CLNTDTL.CLNTID AS "Client Id",
            CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) AS  "Client Name",
            SUM(PRGWORK.WORKHOURS) "Billable Hours", 
            SUM(D.QUANTITY) AS  "Billed Hours"
        FROM CLIENTDETAILS CLNTDTL, 
            CASEDETAILS CSEDTL, 
            TPROGRESSRPT PRGRPT, 
            TPROGRESSWORK PRGWORK,TDOCDTL D,TDOCHDR H
        WHERE CLNTDTL.CLNT = CSEDTL.CLNT
            AND CLNTDTL.LANG = CSEDTL.LANG
            AND CLNTDTL.CLNTID = CSEDTL.CLIENTID
            AND CSEDTL.CLNT = PRGRPT.CLNT
            AND CSEDTL.LANG = PRGRPT.LANG
            AND CSEDTL.CLIENTID = PRGRPT.CLIENTID
            AND CSEDTL.CIDSYS = PRGRPT.CIDSYS
            AND PRGRPT.CLNT = PRGWORK.CLNT
            AND PRGRPT.LANG = PRGWORK.LANG
            AND PRGRPT.PRGRPTID = PRGWORK.PRGRPTID
            AND PRGWORK.DOCID=D.DOCID 
            AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
            AND D.DOCID=H.DOCID 
            AND PRGWORK.PRGWORKID  IN (SELECT  PRGWORKID FROM TPROGRESSWORK PRGWORK,TDOCDTL D,TDOCHDR H WHERE PRGWORK.DOCID=D.DOCID and PRGWORK.LINEITEMNO=D.LINEITEMNO AND D.DOCID=H.DOCID AND H.DOCNO != ''	)
            AND PRGWORK.CLNT =  ?
            AND PRGWORK.LANG = ?
            AND CLNTDTL.CLNTID IN (SELECT CLNTID FROM GENCLIENTRUNID GRUN WHERE GRUN.CLNT=PRGWORK.CLNT AND GRUN.LANG=PRGWORK.LANG AND RUNID=? AND ISDEL='N')
        GROUP BY CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ),CLNTDTL.CLNTID
        ORDER BY CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM )

    ) TAB
`; */

export const exportBilledHoursHeaderQuery = `
    SELECT
        "Client Id",
        "Client Name",
        "Billable Hours",
        "Billed Hours"
            
    UNION

    SELECT * FROM 
    (

        SELECT 
            CLNTDTL.CLNTID AS "Client Id",
            CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) AS  "Client Name",
            SUM(PRGWORK.WORKHOURS) "Billable Hours", 
            SUM(D.QUANTITY) AS  "Billed Hours"
        FROM CLIENTDETAILS CLNTDTL, 
            CASEDETAILS CSEDTL, 
            TPROGRESSWORK PRGWORK,TDOCDTL D,TDOCHDR H
        WHERE CLNTDTL.CLNT = CSEDTL.CLNT
            AND CLNTDTL.LANG = CSEDTL.LANG
            AND CLNTDTL.CLNTID = CSEDTL.CLIENTID
            AND PRGWORK.DOCID=D.DOCID 
            AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
            AND D.DOCID=H.DOCID 
            AND CSEDTL.CIDSYS = PRGWORK.CIDSYS
            AND COALESCE(PRGWORK.ISBILLED,'N') = 'Y'
            AND PRGWORK.PRGWORKID  IN (SELECT  PRGWORKID FROM TPROGRESSWORK PRGWORK,TDOCDTL D,TDOCHDR H WHERE PRGWORK.DOCID=D.DOCID and PRGWORK.LINEITEMNO=D.LINEITEMNO AND D.DOCID=H.DOCID AND H.DOCNO != ''	)
            AND PRGWORK.CLNT =  ?
            AND PRGWORK.LANG = ?
            AND CLNTDTL.CLNTID IN (
                    select SUBSTRING_INDEX(SUBSTRING_INDEX(?,',',num),',',-1) as 'Name' 
                    from 
                    (
                        select DISTINCT (t*10+u+1) as 'num' 
                        from
                        (	select 0 t union select 1 union select 2 union select 3 union select 4 union
                         select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                         union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                         union select 17 union select 18 union select 19 union select 20 
                        ) A,
                        (	select 0 u union select 1 union select 2 union select 3 union select 4 union
                         select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                         union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                         union select 17 union select 18 union select 19 union select 20 
                        ) B
        
                    ) nums
                    where num < CHAR_LENGTH(?)-CHAR_LENGTH(REPLACE(?, ',', '')) + 2
                    order by num
            )
        GROUP BY CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ),CLNTDTL.CLNTID
        ORDER BY CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM )

    ) TAB
`;

// Query for Exporting Billed Hours Details to Excel
export const exportBilledHoursDetailsQuery = `
    SELECT
        "Invoice Number",
        "Invoice Date", 
        "Work Id",  
        "Client Name",
        "Case Title", 
        "Progress Date", 
        "Work Category",
        "Work Date", 
        "Billable Hours",
        "Billed Hours",
        "Progress Detail",  
        "Rate"
            
    UNION

    SELECT * FROM 
    (

            SELECT  
                H.DOCNO AS "Invoice Number",
                DATE_FORMAT (CONVERT(H.DOCDT ,DATE  ),'%m/%d/%Y') AS "Invoice Date", 
                PRGWORK.PRGWORKID AS "Work Id",  
                CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) "Client Name",
                CSEDTL.CASETL AS "Case Title", 
                DATE_FORMAT (CONVERT(PRGWORK.CDATE ,DATE  ),'%m/%d/%Y') AS "Progress Date", 
                PRGWORK.WORKCAT AS "Work Category",
                DATE_FORMAT (CONVERT(PRGWORK.CDATE ,DATE  ),'%m/%d/%Y') AS "Work Date", 
                PRGWORK.WORKHOURS AS "Billable Hours",
                D.QUANTITY AS "Billed Hours",
                PRGWORK.RPTTXT AS "Progress Detail",  
                D.RATE AS "Rate"
            FROM CLIENTDETAILS CLNTDTL, 
                CASEDETAILS CSEDTL, 
                TPROGRESSWORK PRGWORK,
                TDOCHDR H,
                TDOCDTL D
            WHERE CLNTDTL.CLNT = CSEDTL.CLNT
                AND CLNTDTL.LANG = CSEDTL.LANG
                AND CLNTDTL.CLNTID = CSEDTL.CLIENTID
                AND PRGWORK.DOCID=D.DOCID 
                AND PRGWORK.LINEITEMNO=D.LINEITEMNO 
                AND D.DOCID=H.DOCID 
                AND CSEDTL.CIDSYS = PRGWORK.CIDSYS
                AND COALESCE(PRGWORK.ISBILLED,'N') = 'Y'    
                AND H.DOCNO != ''
                AND PRGWORK.CLNT =  ?
                AND PRGWORK.LANG = ?
                AND CLNTDTL.CLNTID IN (
                        select SUBSTRING_INDEX(SUBSTRING_INDEX(?,',',num),',',-1) as 'Name' 
                        from 
                        (
                            select DISTINCT (t*10+u+1) as 'num' 
                            from
                            (	select 0 t union select 1 union select 2 union select 3 union select 4 union
                             select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                             union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                             union select 17 union select 18 union select 19 union select 20 
                            ) A,
                            (	select 0 u union select 1 union select 2 union select 3 union select 4 union
                             select 5 union select 6 union select 7 union select 8 union select 9 union select 10
                             union select 11 union select 12 union select 13 union select 14 union select 15 union select 16
                             union select 17 union select 18 union select 19 union select 20 
                            ) B
            
                        ) nums
                        where num < CHAR_LENGTH(?)-CHAR_LENGTH(REPLACE(?, ',', '')) + 2
                        order by num
                )
            ORDER BY PRGWORK.WORKCAT,PRGWORK.CDATE

    ) TAB

`;



// Query for Exporting Billable Hours Header to Excel
export const exportBillableHoursHeaderQuery = `
    SELECT
        "Client Id",
        "Client Name", 
        "Hours"
            
    UNION

    SELECT * FROM 
    (

        SELECT CLNTDTL.CLNTID AS "Client Id",
                CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) AS  "Client Name",
                SUM(PRGWRK.WORKHOURS) AS  "Hours"	
        FROM TPROGRESSWORK PRGWRK,
            CLIENTDETAILS CLNTDTL,
            CASEDETAILS CASEDTL
        WHERE 
                CLNTDTL.CLNTID=CASEDTL.CLIENTID
                AND CLNTDTL.CLNT=CASEDTL.CLNT
                AND CLNTDTL.LANG=CASEDTL.LANG
                AND PRGWRK.LANG=CASEDTL.LANG
                AND PRGWRK.CLNT=CASEDTL.CLNT
                AND PRGWRK.CIDSYS=CASEDTL.CIDSYS
                AND PRGWRK.CLNT =  ?
                AND PRGWRK.LANG = ?
                AND CLNTDTL.CLNTID=?
                AND PRGWRK.CDATE BETWEEN ? AND ?
                AND CLNTDTL.ISDEL='N'
                AND CASEDTL.ISDEL != 'Y'
                AND PRGWRK.ISDEL != 'Y'
                AND PRGWRK.ISBILLED != 'Y'
            GROUP BY CLNTDTL.CLNTID

    ) TAB
`;


// Query for Exporting Billable Hours Details to Excel
export const exportBillableHoursDetailsQuery = `
    SELECT
        "Case ID",
        "Work ID",
        "Client Name",
        "Service Type",
        "Report Date",
        "Progress Details", 
        "Work Category", 
        "Work Date", 
        "Hours",
        "Rate"
            
    UNION

    SELECT * FROM 
    (

        SELECT 	  
            PRGWORK.CIDSYS AS "Case ID",
            PRGWORK.PRGRPTID AS "Work ID",
            CONCAT( CNLDT.FIRSTNM,  ' ', CNLDT.LASTNM ) AS "Client Name",
            CD.SERVICETYP AS "Service Type",
            PRGWORK.CDATE AS "Report Date",
            PRGWORK.RPTTXT AS "Progress Details", 
            PRGWORK.WORKCAT AS "Work Category", 
            PRGWORK.CDATE AS "Work Date", 
            PRGWORK.WORKHOURS "Hours",
            T.RATE "Rate"
        FROM TPROGRESSWORK PRGWORK 
            LEFT OUTER JOIN TRATECARD T ON  PRGWORK.WORKCAT=T.WORKCAT
            LEFT OUTER JOIN TWORKCAT W ON  PRGWORK.WORKCAT=W.CATCD
            LEFT OUTER JOIN CASEDETAILS CD ON  PRGWORK.CIDSYS=CD.CIDSYS 
            LEFT OUTER JOIN CLIENTDETAILS CNLDT ON CD.CLIENTID=CNLDT.CLNTID
        WHERE PRGWORK.ISBILLED != 'Y'
            AND PRGWORK.CLNT =?
            AND PRGWORK.LANG =?
            AND CNLDT.CLNTID=?
            AND PRGWORK.CDATE BETWEEN ? AND ?
            AND CD.ISDEL='N'
            AND PRGWORK.CDATE BETWEEN T.FROMDATE AND T.TODATE
            ORDER BY PRGWORK.WORKCAT,PRGWORK.CDATE

    ) TAB
`;


/**
 * Section 3 : Queries for JSReport Data
 */
// Query for to get Invoice Header
export const invoiceReportHeaderQuery = `
    SELECT  CMPNY.COFF,CMPNY.PHNO ,CMPNY.ADDR, CMPNY.ADDR1, CMPNY.CITY, CNTRY.CNAME COUNTRY, CMPNY.PINC
    FROM TDOCHDR HDR, MCMPN CMPNY, MCOUNTRY1 CNTRY
    WHERE HDR.CLNT = CMPNY.CLNT
        AND HDR.LANG = CMPNY.LANG
        AND HDR.CMPN = CMPNY.CMPN
        AND CMPNY.CLNT = CNTRY.CLNT
        AND CMPNY.LANG = CNTRY.LANG
        AND CMPNY.COUNTRY = CNTRY.CID
        AND HDR.CLNT= ?
        AND HDR.LANG= ?
        AND HDR.DOCID =  ?
`;


// Query for to get Invoice Title
export const invoiceReportTitleQuery = `
    SELECT HDR.CUSTOMER BILLTO, HDR.DOCNO INVOICENO, DATE_FORMAT(HDR.INVDT, "%m/ %d/ %Y") DATEISSUED,  DATE_FORMAT(HDR.DUEDT, "%m/ %d/ %Y") PAYMENTDUE,HDR.BAL AMOUNTDUE,CLNTDTL.OFFICENM,CLNTDTL.PHONE,CLNTDTL.EMAILID
        FROM TDOCHDR HDR,CLIENTDETAILS CLNTDTL
        WHERE
            HDR.CLNT=CLNTDTL.CLNT AND
            HDR.LANG=CLNTDTL.LANG AND
            HDR.CUSTCD=CLNTDTL.CLNTID AND
            HDR.CLNT= ? AND
            HDR.LANG= ? AND
            HDR.DOCID =  ?
`;


// Query for to get Invoice Item Details
export const invoiceReportItemsQuery = `
    SELECT (@row_number:=@row_number + 1) AS num,DTL.PARTDESC PRODUCT, DTL.QUANTITY QUANTITY, HDR.BAL AMOUNTDUE, DTL.RATE PRICE, DTL.AMOUNT AMOUNT
        FROM TDOCHDR HDR, TDOCDTL DTL,(SELECT @row_number:=0) AS t
        WHERE HDR.DOCID = DTL.DOCID
                AND HDR.CLNT = DTL.CLNT
                AND HDR.LANG = DTL.LANG
                AND DTL.CLNT= ?
                AND DTL.LANG= ?
                AND DTL.DOCID = ?

`;


// Query for to get Invoice Total
export const invoiceReportTotalQuery = `
SELECT '' STAX,
                        '' STAXPERCENT,
                        '' VAT,
                        '' VATPERCENT,
                        '' SUBTOTAL,
                        TAXAMOUNT TOTAL,
                        '' CURRENCY
        FROM TTAXAMOUNT 
        WHERE 
                CLNT=? AND
                LANG=? AND
                DOCID =  ? AND
                TRIM(TAXTYPE) = 'TOTAL'
`;


//Progress report js query 
export const progressReportQuery=`
SELECT CASEDTL.CIDSYS AS  "CASEID", CONCAT( CLNTDTL.FIRSTNM,  ' ', CLNTDTL.LASTNM ) AS  "CLIENTNAME", CLNTDTL.OFFICENM AS "BUSINESSNAME", DATE_FORMAT( STR_TO_DATE( CASEDTL.CDATE,  '%Y%m%d' ) ,  '%m.%d.%Y' ) AS  "STARTDATE", CASEDTL.SERVICETYP AS  "CASETYPE", DATE_FORMAT( STR_TO_DATE( TPRGWORK.CDATE,  '%Y%m%d' ) ,  '%m.%d.%Y' ) AS  "PRGWRKCDATE",DATE_FORMAT( STR_TO_DATE( TPRGWORK.UDATE,  '%Y%m%d' ) ,  '%m.%d.%Y' ) AS  "PRGWRKUDATE", TPRGWORK.RPTTXT AS  "DETAILS", TPRGWORK.DOCNM AS  "ATTACHMENTS"
FROM CASEDETAILS CASEDTL JOIN  CLIENTDETAILS CLNTDTL ON CASEDTL.CLNT = CLNTDTL.CLNT AND CASEDTL.LANG = CLNTDTL.LANG AND CASEDTL.CLIENTID = CLNTDTL.CLNTID
LEFT OUTER JOIN TPROGRESSWORK TPRGWORK ON CASEDTL.CLNT = TPRGWORK.CLNT AND CASEDTL.LANG = TPRGWORK.LANG AND CASEDTL.CIDSYS = TPRGWORK.CIDSYS
    WHERE 
        CASEDTL.CLNT = ?
        AND CASEDTL.LANG = ?
        AND CASEDTL.CIDSYS = ?
        ORDER BY CASEDTL.CIDSYS
`;


export const checkDuplicateUsersAuthQuery =`
    SELECT COUNT(*) COUNT FROM tusrauth 
        WHERE  CLNT = ? 
        AND LANG = ? 
        AND USRID= ?
        AND AUTHCD = ? 
        AND AUTHTYP = ? 
    `;



// export const otherservices =`
//     SELECT DISTINCT (DESC1) AS "DESC",CODE AS "CODE" FROM ( 
//         SELECT CLNT,LANG,CONCAT(STCODE , '-',SUBSTCODE)AS "CODE",SUBSTDESC AS "DESC1" FROM SERVTYP1 WHERE STCODE!='10' 
//         UNION 
//         SELECT CLNT,LANG,STCODE AS "CODE", STDESC AS "DESC1" FROM SERVTYP1 WHERE STCODE!='10' 
//     ) AS SERV WHERE CLNT= ? AND LANG=?`; 
    

export const otherservices =`
SELECT DISTINCT (DESC1) AS "DESC",CODE AS "CODE" FROM ( 
    SELECT CLNT,LANG,CONCAT(STCODE , '-',SUBSTCODE)AS "CODE",SUBSTDESC AS "DESC1" FROM SERVTYP1 WHERE STCODE!='10' 
    UNION 
    SELECT CLNT,LANG,STCODE AS "CODE", STDESC AS "DESC1" FROM SERVTYP1 WHERE STCODE!='10' 
) AS SERV WHERE CLNT= ? AND LANG=? and  code not in('60','20') ORDER by DESC1`;

export const leadsmaillist=`SELECT * FROM MAILLOGS WHERE
CLNT=?
AND LANG=?
AND UPPER(MAILFOR)=UPPER(?) 
AND MAILFORID LIKE (?) AND 
CDATE BETWEEN ? AND ? 
AND UPPER(IFNULL(CUSER,'')) LIKE  UPPER(?)`;


export const checkDuplicateDocumentQuery=`SELECT COUNT(*) COUNT  FROM TMASTERDOCS 
    WHERE CLNT = ? 
    AND LANG = ? 
    AND DOCID = ?`;