/**
 * @author 
 */

// Import Section
import billingsServices from "../../services/billingsServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for searchBillableHoursHeader(input) : [BillableHours]
        searchBillableHoursHeader : billingsServices.searchBillableHoursHeader,

        // Resolver for searchBillableHoursDetails(input) : [BillableHours]
        searchBillableHoursDetails : billingsServices.searchBillableHoursDetails,

        // Resolver for searchBillableCaseHours(input) : [BillableHours]
        searchBillableCaseHours : billingsServices.searchBillableCaseHours,

        // Resolver for searchInvoices(input) : [Invoices]
        searchInvoices : billingsServices.searchInvoices,

        // Resolver for searchBilledHoursHeader(input) : [BilledHoursHeader]
        searchBilledHoursHeader : billingsServices.searchBilledHoursHeader,

        // Resolver for searchBilledHoursDetails(input) : [BilledHoursDetails]
        searchBilledHoursDetails : billingsServices.searchBilledHoursDetails,

        // Resolver for invoiceDetails(input) : [InvoiceDetails]
        invoiceDetails : billingsServices.invoiceDetails

    },

    Mutation:
    {
        // Resolver for InvoicesCRUDOps(input) : String
        InvoicesCRUDOps : billingsServices.InvoicesCRUDOps,

        // Resolver for updateInvoiceStatus(input) : String
        updateInvoiceStatus : billingsServices.updateInvoiceStatus

    }
};



// Export the resolvers
module.exports = resolvers;