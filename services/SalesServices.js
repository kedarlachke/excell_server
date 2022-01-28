import dbServices from '../services/dbServices';
import numberSeries from '../services/numberSeries';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';


const SalesCRUDOps = async (args, context, info) =>{
    console.log(JSON.stringify(args));
    console.log(context);
    console.log(info);
}


export default SalesCRUDOps;