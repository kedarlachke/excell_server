/**
 * @author 
 */

import { merge } from "lodash";

//Importing resolvers
import casesResolvers from './casesResolvers';
import leadsResolvers from './leadsResolvers';
import contactsResolvers from './contactsResolvers';
import customersResolvers from './customersResolvers';
import usersResolvers from './usersResolvers';
import tasksResolvers from './tasksResolvers';
import documentsResolvers from './documentsResolvers';
import billingsResolvers from './billingsResolvers';
import clientResolvers from './clientResolvers';
import ddlResolvers from './ddlResolvers';
import taxRateResolvers from './taxRateResolvers';
import settingsResolvers from './settingsResolvers';
import reminderResolvers from './reminderResolvers';
import contractsResolvers from './contractsResolvers';
import paymentAuthorizationResolvers from './paymentAuthorizationResolvers';
import progressReportResolvers from './progressReportResolvers';
import emailResolvers from './emailResolvers';
import jasperReportResolvers from './jasperReportResolvers';
import excelReportResolvers from './excelReportResolvers';
import SignaturesResolvers from './SignaturesResolvers';
import ratecardResolvers from './ratecardResolvers';
import authenticationResolvers from './authenticationResolvers';
import docResolver from './docResolvers';

// Merge all of the resolver objects together
const resolvers = merge(
                            casesResolvers.Query,
                            casesResolvers.Mutation,
                            leadsResolvers.Query,
                            leadsResolvers.Mutation,
                            contactsResolvers.Query,
                            contactsResolvers.Mutation,
                            contractsResolvers.Query,
                            contractsResolvers.Mutation,
                            customersResolvers.Query,
                            customersResolvers.Mutation,
                            usersResolvers.Query,
                            usersResolvers.Mutation,
                            tasksResolvers.Query,
                            tasksResolvers.Mutation,
                            documentsResolvers.Query,
                            documentsResolvers.Mutation,
                            billingsResolvers.Query,
                            billingsResolvers.Mutation,
                            clientResolvers.Query,
                            clientResolvers.Mutation,
                            ddlResolvers.Query,
                            taxRateResolvers.Query,
                            settingsResolvers.Query,
                            settingsResolvers.Mutation,
                            reminderResolvers.Query,
                            reminderResolvers.Mutation,
                            paymentAuthorizationResolvers.Query,
                            paymentAuthorizationResolvers.Mutation,
                            progressReportResolvers.Query,
                            progressReportResolvers.Mutation,
                            emailResolvers.Mutation,
                            jasperReportResolvers.Query,
                            excelReportResolvers.Query,
                            SignaturesResolvers.Query,
                            SignaturesResolvers.Mutation,
                            ratecardResolvers.Query,
                            ratecardResolvers.Mutation,
							authenticationResolvers.Query,
                            authenticationResolvers.Mutation,
                            docResolver.Mutation,
                            docResolver.Query
                        );

// Export merged resolvers
module.exports = resolvers;