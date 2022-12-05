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

      getReportsPageable:(page,pageSize, reportHelper, approvedByMe)=>{
        return instance.post(`/rest/report/all/${page}/${pageSize}`, reportHelper,{
            headers:{
                'Content-Type': 'application/json',
                'approvedByMe': approvedByMe
            }
        })    
    },

    timeSpentOnReportsByUser:(reportFilter) => {
      return instance.post(`/rest/report/timeSpentOnReportsByUser`, reportFilter);
    },

      getNumberOfNotApprovedReportsForLoggedUser:()=>{
        return instance.get(`/rest/report/getNumberOfNotApprovedReportsForUser`)
    },

    getNotApprovedReportsForLoggedUser:()=>{
      return instance.get(`/rest/report/getNotApprovedReportsForLoggedUser`);
    },

    acceptReport:(reportIdsHelper)=>{
      return instance.post(`/rest/report/acceptReports`, reportIdsHelper);
    }
}
export default ReportService;

