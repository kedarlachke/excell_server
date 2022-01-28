/**
 * @author 
 */

import { mergeTypes } from "merge-graphql-schemas";

// Importing types
import casesTypes from './casesTypes';
import leadsTypes from './leadsTypes';
import contactsTypes from './contactsTypes';
import customersTypes from './customersTypes';
import usersTypes from './usersTypes';
import tasksTypes from './tasksTypes';
import documentsTypes from './documentsTypes';
import billingsTypes from './billingsTypes';
import clientTypes from './clientTypes';
import ddlTypes from './ddlTypes';
import enumTypes from './enumTypes';
import taxRateTypes from './taxRateTypes';
import docHeaderTypes from './docHeaderTypes';
import docDetailTypes from './docDetailTypes';
import taxAmountTypes from './taxAmountTypes';
import settingsTypes from './settingsTypes';
import reminderTypes from './reminderTypes';
import contractsTypes from './contractsTypes';
import paymentAuthorizationTypes from './paymentAuthorizationTypes';
import progressReportTypes from './progressReportTypes';
import emailTypes from './emailTypes';
import jasperReportTypes from './jasperReportTypes';
import excelReportTypes from './excelReportTypes';
import SignatureTypes from './SignatureTypes';
import ratecardTypes from './ratecardTypes';
import user_type from './user_type';
import docType from './docType';


// Merge all of the types together
const types = [
                casesTypes,
                leadsTypes,
                contactsTypes,
                customersTypes,
                usersTypes,
                tasksTypes,
                documentsTypes,
                billingsTypes,
                clientTypes,
                ddlTypes,
                enumTypes,
                taxRateTypes,
                docHeaderTypes,
                docDetailTypes,
                taxAmountTypes,
                settingsTypes,
                reminderTypes,
                contractsTypes,
                paymentAuthorizationTypes,
                progressReportTypes,
                emailTypes,
                jasperReportTypes,
                excelReportTypes,
                SignatureTypes,
                ratecardTypes,
                user_type,
                docType
              ];
  
// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
const typeDefs =  mergeTypes(types, { all: true });

module.exports = typeDefs;