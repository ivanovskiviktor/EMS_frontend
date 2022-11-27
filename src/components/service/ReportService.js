import axios from 'axios';
import instance from '../instance/instance';

const ReportService ={

    getReportById: (id)  => {
        return instance.get(`rest/report/get/${id}`);
      },

    createReport: (reportDetails) => {
        return instance.post(`/rest/report/create`,reportDetails,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
              },
        });
      },

      getNumberOfNotApprovedReportsForLoggedUser:()=>{
        return instance.get(`/rest/report/getNumberOfNotApprovedReportsForUser`)
    }
}
export default ReportService;

