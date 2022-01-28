
/**
 * Generates email template for invoice mail
 * @param {} invoice   Invoice object with fields like invoice no, customer name, invoice date, etc. 
 */
const invoiceTemplate = (invoice) =>
{
    invoice = invoice || {};

    if(Object.keys(invoice).length == 0)
        throw new Error("Empty invoice object found.");

    return `
        <html><body>
        <div marginwidth=\"0\" marginheight=\"0\">

        <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
        <tbody><tr>
        <td width=\"100%\" valign=\"top\" bgcolor=\"#f8f8f8\">

        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ffffff\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1;border-top:1px solid #e1e1e1;margin-top:50px\">
        <tbody><tr>
            <td width=\"460\">

            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td height=\"30\">
                </td>
                </tr>
            </tbody></table>

            
            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td width=\"40\"></td>
                <td width=\"460\" style=\"font-size:16px;color:#b8b9c1;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">
                    <img src=\"https://ci3.googleusercontent.com/proxy/EQmfPPEBOS3Y-P6Rr-8qB-4zmOADTCA3ZYTiSaIHIm1KMhFXfXZjj3nEJN_D48LSjKmVYcf0FMOUksX9W-ThFmJZ9iiltnPjhoaDQarmGHouzhFjxyxLZQCsbF2kyR4HpyQxZ_60ToyLF42wScCT8WHvpJLVeL6d231q3vLFptGha_9p=s0-d-e1-ft#https://d13urdz427oqex.cloudfront.net/uploads/invoices/business_logos/7fdccbe1-00f0-4459-b39c-d7a2e0eeaa8b.png\" style=\"margin:0 0 20px 0;width:180px\" width=\"180\" class=\"CToWUd\">
                </td>
                <td width=\"40\"></td>
                </tr>
            <tr>
                <td width=\"40\"></td>
                <td width=\"460\" style=\"font-size:16px;color:#b8b9c1;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">
                    
                    <span style=\"text-decoration:none;color:#2f2f36;font-weight:bold;font-size:32px;line-height:32px\">Invoice #`+invoice.invno+`</span><br>
                    
                </td>
                <td width=\"40\"></td>
                </tr>
                <tr>
                <td width=\"40\"></td>
                <td width=\"460\" style=\"font-size:16px;color:#a0a0a5;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">
                    for `+invoice.custname+`<br>
                    issued on `+invoice.invdate+`<br>
                    from <b>`+invoice.company+`</b>
                </td>
                <td width=\"40\"></td>
                </tr>
                <tr>
                <td width=\"40\"></td>
                <td width=\"512\" height=\"30\"></td>
                <td width=\"40\"></td>
                </tr>
            </tbody></table>

            </td>
        </tr>
        </tbody></table>


        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" bgcolor=\"#ffffff\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody><tr>
            <td width=\"460\">
            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td width=\"460\" height=\"5\" bgcolor=\"#ffffff\"></td>
                </tr>
                <tr>
                <td width=\"460\" height=\"1\" bgcolor=\"#e1e1e1\"></td>
                </tr>
                <tr>
                <td width=\"460\" height=\"10\" bgcolor=\"#ffffff\"></td>
                </tr>
            </tbody></table>
            </td>
        </tr>
        </tbody>
        </table>


        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ffffff\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody>
            <tr>
            <td width=\"460\">

                <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody>
                    <tr>
                    <td height=\"20\">
                    </td>
                    </tr>
        </tbody>
        </table>

                
        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
            <tbody>
                    <tr>
                    <td width=\"40\"></td>
                    <td width=\"510\" style=\"font-size:14px;color:#444;font-weight:normal;text-align:left;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">
                        
                        
                        `+invoice.cmsg+`
                            <br><br>
                        
                        <p style=\"font-size:18px;border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;padding:10px 0;background:#fefefe;text-align:center;margin:5px 0\">
                        
                            Total Due:
                        
                        <span style=\"white-space:nowrap;font-weight:bold;font-size:18px\">$ `+invoice.totalAmt+` USD</span>
                    </p>
                        <br>
                    </td>
                    <td width=\"40\"></td>
                    </tr>
            </tbody>
        </table>

        </td>
        </tr>
        </tbody>
        </table>


        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ffffff\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody>
            <tr>
            <td width=\"460\">
        
                <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody>
                    <tr>
                    <td width=\"40\"></td>
                    <td width=\"510\" style=\"font-size:14px;color:#a0a0a5;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">

                        <div>
                            
                            <a href="`+ invoice.url +`" style=\"background-color:#00929f;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:200px\" target=\"_blank\">
                            Make Payment
                            </a>

                        

                        </div>
                        <p style=\"margin-top:3px;color:#444\">
                        Due by:
                        <span style=\"white-space:nowrap;font-weight:bold;font-size:14px\">`+invoice.duedate+`</span>
                    </p>
                    </td>
                    <td width=\"40\"></td>
                    </tr>
                    <tr>
                    <td width=\"40\"></td>
                    <td width=\"512\" height=\"10\"></td>
                    <td width=\"40\"></td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>






        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#ffffff\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody><tr>
            <td width=\"460\">

            
            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td width=\"460\" height=\"10\">
                </td>
                </tr>
            </tbody></table>
            

            </td>
        </tr>
        </tbody></table>



        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f9f9f9\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1;border-top:1px solid #e1e1e1\">
        <tbody><tr>
            <td width=\"460\">

            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td height=\"10\">
                </td>
                </tr>
            </tbody></table>

            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td width=\"40\"></td>
                <td width=\"460\" style=\"font-size:16px;color:#b8b9c1;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">

                </td>
                <td width=\"40\"></td>
                </tr>
                <tr>
                <td width=\"40\"></td>
                <td width=\"460\" style=\"font-size:14px;color:#959599;font-weight:normal;font-family:Helvetica,Arial,sans-serif;line-height:20px;text-align:center\">
                    
                    <p>Thanks for your business. If this invoice was sent in error, please contact
                    

                    <a href=\"mailto:`+invoice.compmail+`\" style=\"text-decoration:none;color:#008f9b;font-weight:bold\" target=\"_blank\">rhishikesh.parkhi@gmail.com</a>
                    </p>
                </td>
                <td width=\"40\"></td>
                </tr>
                <tr>
                <td width=\"40\"></td>
                <td width=\"512\" height=\"10\"></td>
                <td width=\"40\"></td>
                </tr>
            </tbody></table>

            </td>
        </tr>
        </tbody></table>


        
        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
            <tbody><tr>
            <td width=\"460\" bgcolor=\"#f0f0f0\">

                
                <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                    <td width=\"460\">

                    
        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                        <tbody><tr>
                        <td width=\"30\"></td>
                        <td width=\"530\">

                            
                    <table width=\"140\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"left\">
                            <tbody><tr>
                                <td width=\"140\">
                                </td>
                            </tr>
                        </tbody></table>
                            

                        </td>
                        <td width=\"30\"></td>
                        </tr>
                    </tbody></table>
                    </td>
                </tr>
                </tbody></table>
            </td>
            </tr>
        </tbody></table>
        



        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
        <tbody><tr>
            <td width=\"460\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;border-radius:0 0 10px 10px;background:#f0f0f0\">

            
            <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td height=\"1\">
                </td>
                </tr>
            </tbody></table>
            

            </td>
        </tr>
        </tbody></table>



        <table width=\"460\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
        <tbody><tr>
            <td height=\"20\"></td>
        </tr>
        <tr>
            <td height=\"30\" style=\"line-height:1px\"></td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>

        </body>
        </html>    
    `;
}



/**
 * Generates email template 
 * @param {*} mailMessage 
 */
const emailTemplate = (mailMessage) =>
{
    mailMessage = mailMessage || '';

    return ` 
        <html><body>
        <div marginwidth=\"0\" marginheight=\"0\">

        <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
        <tbody><tr>
        <td width=\"100%\" valign=\"top\" bgcolor=\"#f8f8f8\">

        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#C4B19B\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1;border-top:1px solid #e1e1e1;margin-top:50px\">
        <tbody><tr>
            <td width=\"660\">

            <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td height=\"30\">
                </td>
                </tr>
            </tbody></table>

            
            <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td width=\"40\"  style=\"padding-left: 15px;\">
                    <a href=\"http://www.excellinvestigations.net\"  target=\"_blank\">
                               
                    <img src=\"https://www.excellinvestigations.net/wp-content/uploads/2018/12/logo2.png\" style=\"margin:0 0 0 0;width:60px\">  
                </td>
                    </a>
                <td width=\"50\" style=\"font-size:16px;color:#b8b9c1;font-weight:normal;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top; padding-left: 10px;\">
                    <h1  style=\"color: ivory;font-size: 24px; margin: 0 0 7px 0;padding: 0;font-size: 18px; font-weight: bold;\">
                    <span>EXCELL INVESTIGATION</span><br>
                    <a href=\"http://www.excellinvestigations.net\" style=\"background-color:#E0DAC5;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:10px;font-weight:bold;line-height:28px;text-align:center;text-decoration:none;height: 29px !important;width:160px\" target=\"_blank\">
                    VISIT OUR WEBSITE
                    </a>
                    </h1>
                </td>
                <td width=\"220\" style=\"vertical-align: text-top;\">
                    <span style=\"text-decoration:none;color:#FFF;font-weight:bold;font-size:15px;line-height:18px\">NEED ASSISTANCE !</span><br>
                    <span style=\"text-decoration:none;color:#FFF;font-weight:bold;font-size:15px;line-height:20px\">1.888.666.0089</span><br>
                </td>
                </tr>
                
            
                <tr>
                <td width=\"40\"></td>
                <td width=\"512\" height=\"30\"></td>
                <td width=\"40\"></td>
                </tr>
            </tbody></table>

            </td>
        </tr>
        </tbody></table>
        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#D6C6B3\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody>
            <tr>
            <td width=\"660\">

                <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody>
                    <tr>
                    <td height=\"20\">
                    </td>
                    </tr>
                </tbody>
                </table>

                
                <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"background:#D6C6B3\">
                <tbody>
                    <tr>
                    <td width=\"40\"></td>
                    <td width=\"510\" style=\"font-size:14px;color:#444;font-weight:normal;text-align:left;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">
                        
                        
                        `+mailMessage+`
                            <br><br>
                        
                    
                        <br>
                    </td>
                    <td width=\"40\"></td>
                    </tr>
                </tbody>
                </table>

            </td>
            </tr>
        </tbody>
        </table>


        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#D6C6B3\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody>
            <tr>
            <td width=\"660\">

                
            </td>
            </tr>
        </tbody>
        </table>






        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#D6C6B3\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
        <tbody><tr>
            <td width=\"660\">

            
            <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#D6C6B3\" align=\"center\">
                <tbody><tr>
                <td width=\"660\" height=\"10\">
                </td>
                </tr>
            </tbody></table>
            

            </td>
        </tr>
        </tbody></table>



        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f9f9f9\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1;\">
        <tbody><tr>
            <td width=\"660\">

            <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" bgcolor=\"#D6C6B3\">
                <tbody><tr>
                <td height=\"10\">
                </td>
                </tr>
            </tbody></table>

            <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"  align=\"center\" bgcolor=\"C4B19B\">
                <tbody><tr>
                <td width=\"40\"></td>
                <td width=\"660\" style=\"font-size:16px;color:#b8b9c1;font-weight:normal;text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:24px;vertical-align:top\">

                </td>
                <td width=\"40\"></td>
                </tr>
                <tr>
                <td width=\"40\"></td>
                <td width=\"660\" style=\"font-size:14px;color:#fff;font-weight:normal;font-family:Helvetica,Arial,sans-serif;line-height:50px;text-align:center\">
                    
                    <p>Excellinvestigations.net &#169; `+new Date().getFullYear()+`  - All Rights Reserved.
                    

                    <a href=\"mailto:\"+compmail+\"\" style=\"text-decoration:none;color:#008f9b;font-weight:bold\" target=\"_blank\"></a>
                    </p>
                </td>
                <td width=\"40\"></td>
                </tr>
                <tr>
                <td width=\"40\"></td>
                <td width=\"512\" height=\"10\"></td>
                <td width=\"40\"></td>
                </tr>
            </tbody></table>

            </td>
        </tr>
        </tbody></table>
        
        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1\">
            <tbody><tr>
            <td width=\"660\" bgcolor=\"#f0f0f0\">

                
                <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                    <td width=\"660\">

                    
        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                        <tbody><tr>
                        <td width=\"30\"></td>
                        <td width=\"530\">
                            <table width=\"140\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"left\">
                            <tbody><tr>
                                <td width=\"140\">
                                </td>
                            </tr>
                        </tbody></table>
                            

                        </td>
                        <td width=\"30\"></td>
                        </tr>
                    </tbody></table>
                    </td>
                </tr>
                </tbody></table>
            </td>
            </tr>
        </tbody></table>
        



        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
        <tbody><tr>
            <td width=\"660\" style=\"border-left:1px solid #e1e1e1;border-right:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;border-radius:0 0 10px 10px;background:#f0f0f0\">

            
            <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
                <tbody><tr>
                <td height=\"1\">
                </td>
                </tr>
            </tbody></table>
            

            </td>
        </tr>
        </tbody></table>



        <table width=\"660\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">
        <tbody><tr>
            <td height=\"20\"></td>
        </tr>
        <tr>
            <td height=\"30\" style=\"line-height:1px\"></td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        
        </body></html>

    `;
}



// Export module functions
module.exports = {
    invoiceTemplate,
    emailTemplate
}