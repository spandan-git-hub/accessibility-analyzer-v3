import axios from 'axios';       

const analyzeUrl = async (url) => {
    const res = await axios.post(`${process.env.REACT_APP_API_ENDPT}/analysis`,{ url });
    return res.data;
};

const fetchReports = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_ENDPT}/reports`);
    return res.data;
};
 
const createReport = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_ENDPT}/reports`, data);
    return res.data;
};

// const sendEmail = async (email, report) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_ENDPT}/email`, { email, report });
//     return res.data;
// };

// const updateReport = async (id, data) => {
//   const res = await axios.put(`${process.env.REACT_APP_API_ENDPT}/reports/${id}`, data);
//   return res.data;
// };

const deleteReport = async (id) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_ENDPT}/reports/${id}`);
  return res.data;
};

const generatePDF = async (report) => {
    const res = await axios.post(`${process.env.REACT_APP_API_ENDPT}/generate-pdf`, { report }, {
        responseType: 'blob'
    });
    return res.data;
};

const emailPDF = async (email, report) => {
    const res = await axios.post(`${process.env.REACT_APP_API_ENDPT}/email-pdf`, { email, report });
    return res.data;
};

// const fetchReport = async (id) => {
//   const res = await axios.get(`${process.env.REACT_APP_API_ENDPT}/reports/${id}`);
//   return res.data;
// };

export { analyzeUrl, fetchReports, createReport, deleteReport, generatePDF, emailPDF };