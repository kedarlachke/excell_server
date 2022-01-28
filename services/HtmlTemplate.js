const config = {
 

   // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
   //"height": "10.5in",        // allowed units: mm, cm, in, px
   //"width": "800px",            // allowed units: mm, cm, in, px
   
   "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
   "orientation": "portrait", // portrait or landscape
  
   // Page options
   
   "border": {
     "top": "0.4in",            // default is 0, units: mm, cm, in, px
     "right": "1in",
     "bottom": "0in",
     "left": "1in"
   },
  
   paginationOffset: 1,       // Override the initial pagination number
   "header": {
     "height": "50px",
     "contents": {
        1:`<div style="border-bottom: 1px solid #4d3123;float: left;width: 100%;padding-bottom:10">		
         <!-- <div style="float:left">
         <img src="/img/logo.png" 
         alt="Los Angeles, CA Licensed Private Investigator" 
         title="Excell Investigations" height="50" width="50"/>
         </div>-->
        <div style="float:left;color:#4d3123;">
           <div style="font-size:16px;fontWeight:600;">Excell Investigations</div>
           <div style="font-size:12">(800) 644-6080</div>
        
     </div></div>`}
   },
   "footer": {
     "height": "80px",
     "contents": {
       1: `<div><hr/><!--<div style="text-align: center;font-size:10">1</div>--><div style="font-size:6;color:#4d3123">
       <div style="width: 30%;float:left;border: 1px solid white"><div></div><div></div><div></div></div>
       <div style="width: 39%;text-align:center;float:left;"><div>CONFIDENTIAL AND RECOMMENDED</div><div>PRIVATE INVESTIGATION SERVICE</div><div>SINCE 1992</div></div>
       <div style="width: 30%;text-align:right;float:left;"><div>FREE Confidential Consultation</div><div style="color:#a4332f;">(800) 644-6080</div><div>Se habla español</div></div>
       <div></div>`,
       2: '<div><hr/><div style="text-align: center;">2</div></div>', // Any page number is working. 1-based index
       3: '<div><hr/><div style="text-align: center;">3</div></div>', // fallback value
       4: '<div><hr/><div style="text-align: center;">4</div></div>', // fallback value
       5: '<div><hr/><div style="text-align: center;">5</div></div>',
       6: '<div><hr/><div style="text-align: center;">6</div></div>',
       7: '<div><hr/><div style="text-align: center;">7</div></div>', // Any page number is working. 1-based index
       8: '<div><hr/><div style="text-align: center;">8</div></div>', // fallback value
       9: '<div><hr/><div style="text-align: center;">9</div></div>', // fallback value
       10: '<div><hr/><div style="text-align: center;">10</div></div>'
     }
    },
  
   
   // Zooming option, can be used to scale images if `options.type` is not pdf
   "zoomFactor": "1", // default is 1
  
 
  
  
 }

const CustomContract= async(contacttext)=>{
   return `<!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>PDF Result Template</title>
         <style>
            .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
            }
            .margin-top {
            margin-top: 50px;
            }
            
         </style>
      </head>
      <body>
     <div class="invoice-box">${contacttext}</div>
     </body>
     </html>`
}

const InfidelityContract=async(FULLNM,CONTACTTYPE,TOTAL,RATEPERH,RATEPERM,OTHER,FEE)=>{
   return `<!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>PDF Result Template</title>
         <style>
            .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            //border: 1px solid #eee;
            //box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 12px;
            line-height: 18px;
            font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
            }
            .margin-top {
            margin-top: 50px;
            }
            
         </style>
      </head>
      <body>
     <div style="font-size:10px;"><b> ${FULLNM}</b>, hereinafter referred to as “CLIENT” DOES hereby agree to retain the services of Excell Investigation, a private investigative agency, duly licensed under the laws of the state of California, which maintains its offices at 8105 East 2nd Street, Downey, CA, for the purpose of performing the following investigative work:
     <br/><u><b>${CONTACTTYPE}</b></u><br/><br/>
     <b>CLIENT</b> agrees to pay a retainer for services of Excell Investigations or its agents the sum of <b>$ ${TOTAL}</b>,
      the hourly rate shall be <b>$ ${RATEPERH}</b>  per hour plus <b>$ ${RATEPERM}</b> per mile. The balance shall be due payable before the completion of the case.
      In the event it becomes necessary for and investigator to testify at deposition or in court, Excell Investigations shall be compensated at the same hourly rate for such time, 
      including such actual travel time with a minimum of (5) hours chargeable (unless agreed otherwise in the underline clause below).${OTHER==null||OTHER===''?`<br/><br/><hr/><br/><hr/>`:`<br/><u>${OTHER}</u>.`}
      <br/>In consideration of the forgoing terms, it is understood that <strong>Excell Investigations shall use it best efforts to investigate the matters set forth and perform the services for which it is being retained. Excell shall explore all lawful means to assure the best performance and results and to do all necessary, appropriate or advisable in performing said services.  Excell promises to provide all proof of services which may include any of the Following: (written reports, statements, video documentation, photographs, information services reports, etc….) to guarantee our thorough and sincere efforts. Excell promise to provide a detailed invoice that outlines all expenses or your money back guarantee…! </strong>It is understood results cannot be guaranteed, compensation to Excell Investigation shall not be based on results.
      <br/><br/><strong>In the Event that Excell Investigation is unable or unsuccessful to obtain any information or unable to provide proof of service a complete refund will be issued.</strong> However out-of-pocket expenses, travel time and information service costs shall not be refunded.
      <br/><br/><strong>Excell Investigations agrees to conduct this investigation with due diligence to protect the interests of CLIENT, and agrees that whatever confidential information is obtained while conducting the investigation, will only be given to CLIENT and further agrees to restrict the dissemination of said findings to any third party.</strong>
      <br /><br />No service shall be rendered by Excell Investigations to CLIENT until such time as the retainer has been paid and this retainer agreement signed. A copy or fax of the retainer agreement will be valid as an original and will  be sent to the CLIENT.
      <br /><br />Any amounts or expenses incurred above the full retainer amount of <b>$ ${FEE}</b> balance shall be due payable immediately upon notice. In the event of default in payment of sums due hereunder and if the agreement is placed in the hand of an attorney at law, small claims, or collection including time spent in court, at the same rate per hour agreed. This includes but not limited to any reasonable attorney’s fees. Payments arriving after the due date will be considered late and a service charge of 1.5% per month (compounded monthly) of the balance due will be charged to the client. Client consents to collection jurisdiction in the state, or county of Excell Investigation’s Choice.
      <br/><br/><strong>Excell Investigations</strong> reserves the right to withhold the release of any information which it develops during the course of the investigation in the event the CLIENT has failed to pay for services rendered and costs incurred.
      <br/><br/>In the event the CLIENT chooses to pay for services with a visa, MasterCard, pay pal or any other form of charge CLIENT agrees not to dispute any charge with the understanding that this service is simply an attempt to gather information in the said Investigation and that results can never be guaranteed.    
      <br/><br/>In the event that CLIENT terminates this agreement, CLIENT agrees that the retainer paid to Excell Investigation shall remain the property of Excell investigation and shall be forfeited by CLIENT. CLIENT further agrees to pay promptly in full all fees for additional services, expenses, mileage or other costs, which exceed the amount of the retainer. Any balance of retainer not used by CLIENT will be applied to future investigations required b the client for a period of five years.
      <br/><br/><br/>Excell Investigations does not warrant or guarantee the accuracy or completeness of any information used in the preparation of its reports, CLIENT further agrees to defend, indemnify and hold EXCELL INVESTIGATIONS and/or its agents, associates, and employees harmless from any and all action, courses of action, claims, damages and demands of whatever type arising directly or indirectly from the services EXCELL INVESTIGATIONS are being retained to perform pursuant to this agreement.
     <br/><br/>This agreement shall be construed in accordance with the laws of the state of California. If any portion of this agreement is determined to be invalid or unenforceable, the remainder of the agreement shall continue in full force and effect. There are no other agreements, express, implied, written, oral or otherwise, except as expressly set forth herein. This Agreement may only by modified in writing signed by both parties.
      </div>
     </body>
     </html>`
}

const AssetContract=async(FULLNM,CONTACTTYPE,TOTAL,RATEPERH,RATEPERM,OTHER,FEE)=>{
return `<!doctype html>
<html>
   <head>
      <meta charset="utf-8">
      <title>PDF Result Template</title>
      <style>
         .invoice-box {
         max-width: 800px;
         margin: auto;
         padding: 30px;
         //border: 1px solid #eee;
         //box-shadow: 0 0 10px rgba(0, 0, 0, .15);
         font-size: 12px;
         line-height: 18px;
         font-family: 'Helvetica Neue', 'Helvetica',
         color: #555;
         }
         .margin-top {
         margin-top: 50px;
         }
         
      </style>
   </head>
   <body>
  <div style="font-size:10px;">
  <p>${FULLNM}, Hereinafter referred to as “<b>CLIENT</b>” DOES hereby agree to retain the services of Excell Investigation, a private investigative agency and Registered Process Server, duly licensed under the laws of the state of California, which maintains its Headquarter offices at 8105 East 2nd Street, Downey, CA, for the purpose of performing the following investigative work: Asset Search:</p>
  <p><b><u>${CONTACTTYPE}</u></b> <strong>CLIENT</strong> agrees to pay a retainer for services of Excell Investigations or its agents the sum of <strong>$ ${TOTAL}</strong>, the Hourly rate shall be <strong>$ ${RATEPERH}</strong> per hour, plus <strong>$ ${RATEPERM}</strong> per mile.plus actual costs and out-of-pocket expenses. (Unlessagreed otherwise in the underline clause below)</p>${OTHER==null||OTHER===''?`<br/><br/><hr/><br/><hr/>`:`<br/><u>${OTHER}</u>.`}
  <br /><br />In consideration of the forgoing terms, it is understood that <strong> Excell Investigation shall use it best efforts and
  resources available to locate the Legal Assets of the subject and perform the services for which it is being
  retained. Excell shall explore all lawful means to assure the best performance and results and to do all
  necessary, appropriate or advisable in performing said services. Excell promises to provide all proof of
  services which may include any of the Following: (written reports, utility searches, video documentation,
  photographs, skip trace and information services reports, etc….) to guarantee our thorough and sincere
  efforts. Excell promises to provide a detailed invoice that outlines all expenses or your money back
  guarantee…!</strong> It is understood results cannot be guaranteed, compensation to Excell Investigation shall not be
      based on results.
                               
                               
<br/><br/><strong>In the Event that Excell Investigation is unable or unsuccessful to obtain any information or unable to provide proof of service a complete refund will be issued. </strong>However out-of-pocket expenses, travel time and information service costs shall not be refunded.

<br/><br/><strong>Excell Investigations agrees to conduct this investigation with due diligence to protect the interests of CLIENT, and agrees that whatever confidential information is obtained while conducting the Process Service, will only be given to CLIENT and further agrees to restrict the dissemination of said findings to any third party.</strong>


      <br /><br />No service shall be rendered by Excell Investigations to CLIENT until such time as the retainer has been paid
and this retainer agreement signed. A copy or fax of the retainer agreement will be valid as an original and a
copy will be sent to the Client.
<br /><br />Any amounts or expenses incurred above the final balance of $ ${FEE} shall be due payable immediately upon
completion of the service. In the event of default in payment of sums due hereunder and if the agreement is
placed in the hand of an attorney at law, small claims, or collection including time spent in court, Excell shall
be compensated at the same rate per hour agreed. This includes but not limited to any reasonable attorney’s
fees. Payments arriving after the due date will be considered late and a service charge of 1.5% per month
(compounded monthly) of the balance due will be charged to the client. Client consents to collection
jurisdiction in the state, or county of Excell Investigation’s Choice.
                          
                          
                         
                          <br/><br/><strong>Excell Investigations</strong> reserves the right to withhold the release of any information which it develops during the
course of the investigation in the event the CLIENT has failed to pay for services rendered and costs incurred.
                                           
                         <br /><br />In the event the CLIENT chooses to pay for services with a visa, MasterCard, pay pal or any other form of
                                      charge CLIENT agrees not to dispute any charge with the understanding that this service is simply an attempt
                                      to gather information in the said Investigation and that results can never be guaranteed.
                                                               
                         <br /><br />In the event that CLIENT terminates this agreement, CLIENT agrees that the retainer paid to Excell Investigation
                                      shall remain the property of Excell investigation and shall be forfeited by CLIENT. CLIENT further agrees to pay
                                      promptly in full all fees for additional services, expenses, mileage or other costs, which exceed the amount of
                                      the retainer. CLIENT agrees that any remaining balance will be charged to the payment method available to
                                      EXCELL. Any balance of retainer not used by CLIENT will be applied to future investigations required b the
                                      client for a period of five years.
                                                                
                          <br /><br />Excell Investigations does not warrant or guarantee the accuracy or completeness of any information used in
                                    the preparation of its reports that comes from outside sources, CLIENT further agrees to defend, indemnify
                                    and hold EXCELL INVESTIGATION and/or its agents, associates, and employees harmless from any and all
                                    action, courses of action, claims, damages and demands of whatever type arising directly or indirectly from
                                    the services EXCELL INVESTIGATION are being retained to perform pursuant to this agreement.
                                                              
                          <br /><br />This agreement shall be construed in accordance with the laws of the state of California. If any portion of this
                  agreement is determined to be invalid or unenforceable, the remainder of the agreement shall continue in full
                  force and effect. There are no other agreements, express, implied, written, oral or otherwise, except as
                  expressly set forth herein. This Agreement may only by modified in writing signed by both parties.

  </div>
</body>
</html>`
}

const ProcessContract=async(FULLNM,CONTACTTYPE,TOTAL,RATEPERH,RATEPERM,OTHER,FEE)=>{
   return `<!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>PDF Result Template</title>
         <style>
            .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            //border: 1px solid #eee;
            //box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 12px;
            line-height: 18px;
            font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
            }
            .margin-top {
            margin-top: 50px;
            }
            
         </style>
      </head>
      <body>
     <div style="font-size:10px;">
     ${FULLNM}, Hereinafter referred to as <strong>“CLIENT”</strong> DOES hereby agree to retain the services of Excell Investigation, a private investigative agency and Registered Process Server, duly licensed under the laws of the state of California, which maintains its Headquarter offices at 8105 East 2nd Street, Downey, CA, for the purpose of performing the following Process service assignment:
                         
                        ${CONTACTTYPE==null||CONTACTTYPE===''?`<br/><br/><hr/><br/><hr/>`:`<u>${CONTACTTYPE}</u>.`}
                               
                        <br/><br/><strong>CLIENT</strong> agrees to pay a retainer for services of Excell Investigations or its agents the sum of <strong>$ ${TOTAL}</strong>, the Hourly rate shall be <strong>$ ${RATEPERH}</strong> per hour, plus <strong>$ ${RATEPERM}</strong> per mile. In the event it becomes necessary for an investigator to testify at deposition or in court, <strong>Excell Investigations </strong>shall be compensated an hourly rate for such time, including such actual travel time with a minimum of 5 hours chargeable (unless agreed otherwise in the underline clause below). 
                                            
                        ${OTHER==null||OTHER===''?`<br/><br/><hr/><br/><hr/>`:`<br/><u>${OTHER}</u>.`} 
                                            <br /><br />In consideration of the forgoing terms, it is understood that <strong> Excell Investigations shall use it best efforts to
                    investigate the matters set forth and perform the services for which it is being retained. Excell shall explore
                    all lawful means to assure the best performance and results and to do all necessary, appropriate or
                    advisable in performing said services. Excell promises to provide all proof of services which may include any
                    of the Following: (Proof of service, written reports, statements, video documentation, photographs,
                    information services reports, etc….) to guarantee our thorough and sincere efforts. Excell promise to provide
                     a detailed invoice that outlines all expenses or your money back guarantee…! </strong> It is understood that not all
                                            results can be guaranteed, compensation to Excell Investigation shall not be based on results
                                                                     
                                                                     
                         <br/><br/><strong>In the Event that Excell Investigation is unable or unsuccessful to obtain any information or unable to provide proof of service a complete refund will be issued. </strong>However out-of-pocket expenses, travel time and information service costs shall not be refunded.
                         
                         <br/><br/><strong>Excell Investigations agrees to conduct this investigation with due diligence to protect the interests of CLIENT, and agrees that whatever confidential information is obtained while conducting the Process Service, will only be given to CLIENT and further agrees to restrict the dissemination of said findings to any third party.</strong>
                        
                        
                        <br/><br/>No service shall be rendered by Excell Investigations to CLIENT until such time as the retainer has been paid and this retainer agreement signed. A copy or fax of the retainer agreement will be valid as an original.
                                            
                         <br /><br />Any amounts or expenses incurred above the retainer fee of $ ${FEE} shall be due payable immediately upon notice. In the event of default in payment of sums due hereunder and if the agreement is placed in the hand of an attorney at law, small claims, or collection including time spent in court, at the same rate per hour agreed. This includes but not limited to any reasonable attorney’s fees. Payments arriving after the due date will be considered late and a service charge of 1.5% per month (compounded monthly) of the balance due will be charged to the client. Client consents to collection jurisdiction in the state, or county of Excell Investigation’s Choice.
                          
                          <br/><br/><strong>Excell Investigations</strong> reserves the right to obtain a current credit report upon receipt of this retainer agreement and subsequently for the purpose of an update or renewal of credit.
                         
                          <br/><br/><strong>Excell Investigations</strong> reserves the right to withhold the release of Proof of service which it develops during the course of the service in the event the CLIENT has failed to pay for services rendered and costs incurred.
                         
                         <br/><br/>In the event the CLIENT chooses to pay for services with a visa, MasterCard, pay pal or any other form of charge CLIENT agrees not to dispute any charge with the understanding that this service is simply an attempt to Serve document  and that results can never be guaranteed. THIS CLAUSE IS EXEMPT
                         
                         <br/><br/>In the event that CLIENT terminates this agreement, CLIENT agrees that the retainer paid to Excell Investigation shall remain the property of Excell investigation and shall be forfeited by CLIENT. CLIENT further agrees to pay promptly in full all fees for additional services, expenses, mileage or other costs, which exceed the amount of the retainer. Any balance of retainer not used by CLIENT will be applied to future investigations required b the client for a period of five years.
                          
                          <br/><br/>Excell Investigations does not warrant or guarantee the accuracy or completeness of any information used in the preparation of its reports, CLIENT further agrees to defend, indemnify and hold EXCELL INVESTIGATIONS and/or its agents, associates, and employees harmless from any and all action, courses of action, claims, damages and demands of whatever type arising directly or indirectly from the services EXCELL INVESTIGATIONS are being retained to perform pursuant to this agreement.
                          
                          <br/><br/>This agreement shall be construed in accordance with the laws of the state of California. If any portion of this agreement is determined to be invalid or unenforceable, the remainder of the agreement shall continue in full force and effect. There are no other agreements, express, implied, written, oral or otherwise, except as expressly set forth herein. This Agreement may only by modified in writing signed by both parties.

     </div></body><html>
`
}

const LocateContract=async(FULLNM,CONTACTTYPE,TOTAL,RATEPERH,RATEPERM,OTHER,FEE)=>{
   return `<!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>PDF Result Template</title>
         <style>
            .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            //border: 1px solid #eee;
            //box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 12px;
            line-height: 18px;
            font-family: 'Helvetica Neue', 'Helvetica',
            color: #555;
            }
            .margin-top {
            margin-top: 50px;
            }
            
         </style>
      </head>
      <body>
     <div style="font-size:10px;">
     ${FULLNM},hereinafter referred to as<strong>“CLIENT”</strong> DOES hereby agree to retain the services of Excell Investigation,a private investigative agency, duly licensed under the laws of the state of California, which maintains its Central offices at 8105 East 2 nd Street, Downey, CA, for the purpose of performing the following investigative work:                       		                       		
     ${CONTACTTYPE==null||CONTACTTYPE===''?`<br/><br/><hr/><br/><hr/>`:`<br/><b><u>${CONTACTTYPE}</u></b>.`}                          
     
                        	    
                        	   <br/> <br/><strong>CLIENT</strong> agrees to pay a retainer for services of Excell Investigations or its agents the sum of <strong>$ ${TOTAL}</strong>, the Hourly rate shall be <strong>$ ${RATEPERH}</strong> per hour, plus <strong>$ ${RATEPERM}</strong> per mile.plus actual costs and out-of-pocket expenses. (Unless agreed otherwise in the underline clause below) 
                                                        
                                                 	
                        		<br />${OTHER==null||OTHER===''?`<br/><br/><hr/><br/><hr/>`:`<br/><u>${OTHER}</u>.`}    
                        		
                        		<br/><br/>In consideration of the forgoing terms, it is understood that <strong>Excell Investigations shall use it best efforts and resources available to locate the subject of the investigation and perform the services for which it is being retained. Excell shall explore all lawful means to assure the best performance and results and to do all necessary, appropriate or advisable in performing said services.  Excell promises to provide all proof of services which may include any of the Following: (written reports, utility searches, video documentation, photographs, skip trace and  information services reports, etc….) to guarantee our thorough and sincere efforts. Excell promise to provide a detailed invoice that outlines all expenses or your money back guarantee…! </strong>It is understood results cannot be guaranteed, compensation to Excell Investigation shall not be based on results. <strong>This Clause is exempt if Client is under the “Guarantee”</strong> Locate<strong> services agreement. </strong>The “Guarantee agreement” pertains to subjects that are locatable in the region the clients advises us to search   
                        		 
                        		 
                        		<br/><br/><strong>In the Event that Excell Investigation is unable or unsuccessful to obtain any information or unable to provide proof of service a complete refund will be issued. </strong>However travel time and information service costs shall not be refunded.
                        		 
                        		 <br/><br/><strong>Excell Investigations agrees to conduct this investigation with due diligence to protect the interests of CLIENT, and agrees that whatever confidential information is obtained while conducting the investigation, will only be given to CLIENT and further agrees to restrict the dissemination of said findings to any third party.</strong>
                        		
                        		<br/><br/>No service shall be rendered by Excell Investigations to CLIENT until such time as the retainer has been paid and this retainer agreement signed. A copy or fax of the retainer agreement will be valid as an original.
                                                                                        	
                        		 <br /><br />Any amounts or expenses incurred above the full retainer fee of $ ${FEE} shall be due payable immediately
upon notice. In the event of default in payment of sums due hereunder and if the agreement is placed in the
hand of an attorney at law, small claims, or collection including time spent in court, Excell shall be
compensated at the same rate per hour agreed. This includes but not limited to any reasonable attorney’s
fees. Payments arriving after the due date will be considered late and a service charge of 1.5% per month
(compounded monthly) of the balance due will be charged to the client. Client consents to collection
jurisdiction in the state, or county of Excell Investigation’s Choice.
                        		  
                        		  {/* <br/><br/><strong>Excell Investigations</strong> reserves the right to obtain a current credit report upon receipt of this retainer agreement and subsequently for the purpose of an update or renewal of credit. */}
                        		 
                        		  <br/><br/><strong>Excell Investigations</strong> reserves the right to withhold the release of any information which it develops during the course of the investigation in the event the CLIENT has failed to pay for services rendered and costs incurred.
                        		 
                        		 <br/><br/>In the event the CLIENT chooses to pay for services with a visa, MasterCard, pay pal or any other form of charge CLIENT agrees not to dispute any charge with the understanding that this service is simply an attempt to gather information in the said Investigation and that results can never be guaranteed.  
                        		 
                        		 <br/><br/>In the event that CLIENT terminates this agreement, CLIENT agrees that the retainer paid to Excell Investigation shall remain the property of Excell investigation and shall be forfeited by CLIENT. CLIENT further agrees to pay promptly in full all fees for additional services, expenses, mileage or other costs, which exceed the amount of the retainer. CLIENT agrees that any remaining balance will be charged to the payment method available to EXCELL. Any balance of retainer not used by CLIENT will be applied to future investigations required b the client for a period of five years.
                        		  
                        		  <br/><br/>Excell Investigations does not warrant or guarantee the accuracy or completeness of any information used in the preparation of its reports that comes from outside sources, CLIENT further agrees to defend, indemnify and hold Excell INVESTIGATIONS and/or its agents, associates, and employees harmless from any and all action, courses of action, claims, damages and demands of whatever type arising directly or indirectly from the services EXCELL INVESTIGATIONS are being retained to perform pursuant to this agreement.
                        		  
                                <br/><br/>This agreement shall be construed in accordance with the laws of the state of California. If any portion of this agreement is determined to be invalid or unenforceable, the remainder of the agreement shall continue in full force and effect. There are no other agreements, express, implied, written, oral or otherwise, except as expressly set forth herein. This Agreement may only by modified in writing signed by both parties.
                                </div></body></html>`

}

module.exports={
   config,
   CustomContract,
   InfidelityContract,
   AssetContract,
   ProcessContract,
   LocateContract
}