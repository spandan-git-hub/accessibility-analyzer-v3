import { useEffect, useState } from 'react';       

import { analyzeUrl, fetchReports, createReport, deleteReport, generatePDF, emailPDF } from '../logic/api';   

import { BiAccessibility, BiHistory, BiSolidDownload } from 'react-icons/bi';
import { HiOutlineSearch } from 'react-icons/hi';
import { MdAttachEmail } from 'react-icons/md';

import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
 
const Dashboard = () => {               

    const [url, setUrl] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport,setSelectedReport] = useState(null);
    // const [editingReport, setEditingReport] = useState(null);
    // const [, setEditForm] = useState({ url: '', totalIssues: 0, passes: 0 });
    const [pdfLoading, setPdfLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);


    const containerVariants = {
        hidden: { opacity: 0 },
        show: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.11,
            delayChildren: 0.13
          }
        }
      };
    
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.22, ease: "easeOut" }
        }
      };

      const dashboardListContainer = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.09,   
            delayChildren: 0.01      
          }
        }
      };
      

    useEffect(() => {
        loadReports();
        }, []);

    const loadReports = async () => {
        try {
            const data = await fetchReports();
            setReports(data);
        } catch (err) {
            console.error('Failed to load reports:', err);
            toast.error('Failed to load reports');
        }
    };

    const handleAnalyze = async () => {
        if (!url) return;

        setLoading (true);

        try {
            const analysis = await analyzeUrl(url);
            const newReport =await createReport(analysis);
            await loadReports();
            setUrl('');
            setSelectedReport(newReport);
            toast.success('Analysis complete!');
        } catch (err) {
            console.error('Analysis failed:', err);
            toast.error('Failed to analyze url');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailPDF = async () => {
      if (!email || !selectedReport) return;
      
      setEmailStatus('Sending...');
      try {
          await emailPDF(email, selectedReport);
          setEmailStatus('Sent successfully!');
          setEmail('');
          toast.success('Email sent successfully!');
          setTimeout(() => {
              setShowEmailModal(false);
              setEmailStatus('');
          }, 2000);
      } catch (err) {
        setEmailStatus('Failed to send email');
        console.error('Email failed:', err);
        toast.error('Failed to send email');
    }
    };

    const handleGeneratePDF = async () => {
        if (!selectedReport) return;
        
        setPdfLoading(true);
        try {
            const pdfBlob = await generatePDF(selectedReport);
            
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `accessibility-report-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('PDF downloaded successfully!');
        } catch (err) {
            console.error('PDF generation failed:', err);
            toast.error('Failed to generate PDF');
        } finally {
            setPdfLoading(false);
        }
    };

    // const handleUpdateReport = async (id, updatedData) => {
    //     try {
    //         await updateReport(id, updatedData);
    //         await loadReports();
    //         setEditingReport(null);
    //         alert('Report updated successfully!');
    //     } catch (error) {
    //         console.error('Failed to update report:', error);
    //         alert('Failed to update report');
    //     }
    // };

    const handleDeleteReport = async (id) => {
        try {
          await deleteReport(id);
          await loadReports();
          toast.success('Report deleted successfully!');
        } catch (error) {
          toast.error('Failed to delete report');
        }
      };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Code copied to clipboard!');
    };

    // const handleEdit = (report) => {
    //     setEditingReport(report);
    //     setEditForm( { url: report.url, totalIssues: report.totalIssues || 0, passes: report.passes || 0 } );
    // };


    return (
        <motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }} 
  className="min-h-screen bg-gray-900 text-white"
  style={{ backgroundColor: "#111827" }} 
>
          {/* Header */}
          <header className="bg-gray-800 shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.05),inset_1px_1px_3px_rgba(0,0,0,0.3)] border-b border-gray-700 sticky top-0 z-40">
              <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.4),-4px_-4px_8px_rgba(255,255,255,0.05)] flex items-center justify-center">
                      <BiAccessibility className="text-white text-3xl mx-auto" />
                      </div>
                      <h1 className="text-3xl font-bold text-white">
                          Accessibility Analyzer
                      </h1>
                  </div>
              </div>
          </header>
  
          <div className="max-w-6xl mx-auto px-6 py-8">
              {/* URL Input */}
              <div className="bg-gray-900 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)] p-8 mb-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.4),-4px_-4px_8px_rgba(255,255,255,0.05)] flex items-center justify-center">
                      <HiOutlineSearch className="text-white text-2xl mx-auto" />
                      </div>
                      <span className="text-white">Analyze a Website</span>
                  </h2>
                  <div className="flex gap-4">
                      <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Enter URL to analyze (e.g., https://example.com)"
                          disabled={loading}
                          className="flex-1 bg-gray-900 border-none text-white placeholder-gray-500 rounded-xl px-6 py-4 shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.05),inset_4px_4px_8px_rgba(0,0,0,0.3)] focus:outline-none focus:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.05),inset_6px_6px_12px_rgba(0,0,0,0.3)] transition-all duration-300"
                          onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                      />
                      <button
                          onClick={handleAnalyze}
                          disabled={loading || !url}
                          className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.05),inset_3px_3px_6px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-300"
                      >
                          {loading ? 'Analyzing...' : 'Analyze'}
                      </button>
                  </div>
              </div>
  
              {/* Reports List */}
              <div className="bg-gray-900 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)] p-8">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.4),-4px_-4px_8px_rgba(255,255,255,0.05)] flex items-center justify-center">
                          <BiHistory className="text-white text-2xl mx-auto" />
                          </div>
                          <span>Previously Analyzed Reports</span>
                      </h2>
                      <span className="text-gray-300">Latest {Math.min(reports.length, 15)} reports</span>
                  </div>
  
                  {reports.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                            <HiOutlineSearch className="text-white text-6xl mb-6 mx-auto" />
                          <p className="text-xl font-medium mb-3">No reports yet</p>
                          <p className="text-gray-500">Analyze a URL to get started</p>
                      </div>
                  ) : (
                    <motion.div
                    className="space-y-4"
                    variants={dashboardListContainer}
                    initial="hidden"
                    animate="show"
                  >
                        <AnimatePresence>
                          {reports.slice(0, 15).map((report, index) => (
                              <motion.div
                              key={report._id || index}
                              className="bg-gray-900 rounded-xl p-6 shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(255,255,255,0.05)] transition-all duration-300"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 40, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                      <div className="flex-1 cursor-pointer min-w-0" onClick={() => setSelectedReport(report)}>
                                          <h3 className="font-bold text-white mb-3 text-lg hover:text-blue-400 transition-colors break-all">
                                              {report.url}
                                          </h3>
                                          <div className="bg-gray-900 px-4 py-2 rounded-lg shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] inline-block">
                                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                                  <span className="flex items-center gap-1">
                                                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                      {report.totalIssues || report.violations?.length || 0} issues found
                                                  </span>
                                                  <span className="flex items-center gap-1">
                                                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                      {report.passes || 0} passes
                                                  </span>
                                                  <span className="text-gray-600">|</span>
                                                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                              </div>
                                          </div>
                                      </div>
  
                                      <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                                          <button
                                              onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                                              className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.05),inset_1px_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-300"
                                          >
                                              View
                                          </button>
                                          <button
                                              onClick={(e) => { e.stopPropagation(); handleDeleteReport(report._id); }}
                                              className="bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.05),inset_1px_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-300"
                                          >
                                              Delete
                                          </button>
                                      </div>
                                  </div>
                              </motion.div>
                          ))}
                      </AnimatePresence>
                      </motion.div>
                  )}
              </div>
          </div>
  
          {/* Email Modal */}
          <AnimatePresence>
  {showEmailModal && (
    <motion.div
    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18 }}
    onClick={() => { setShowEmailModal(false); setEmail(''); setEmailStatus(''); }}
  >
                  <motion.div
        className="bg-gray-900 rounded-2xl shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.05)] max-w-md w-full p-6"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
      >
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-white">  <MdAttachEmail className="inline-block text-2xl align-middle mr-2" /> Send PDF Report via Email</h2>
                          <button 
                              onClick={() => { setShowEmailModal(false); setEmail(''); setEmailStatus(''); }}
                              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors w-8 h-8 rounded-lg flex items-center justify-center"
                          >
                              ×
                          </button>
                      </div>
  
                      <div className="mb-6">
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                              Email Address
                          </label>
                          <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full bg-gray-900 border-none text-white placeholder-gray-500 rounded-xl px-4 py-3 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] focus:outline-none focus:shadow-[inset_-3px_-3px_6px_rgba(255,255,255,0.05),inset_3px_3px_6px_rgba(0,0,0,0.3)] transition-all duration-300"
                              onKeyPress={(e) => e.key === 'Enter' && handleEmailPDF()}
                          />
                      </div>
  
                      {emailStatus && (
                          <div className={`mb-4 p-3 rounded-lg text-sm ${
                              emailStatus.includes('successfully') 
                                  ? 'bg-green-500 text-white' 
                                  : emailStatus.includes('Failed') 
                                      ? 'bg-red-500 text-white' 
                                      : 'bg-blue-500 text-white'
                          }`}>
                              {emailStatus}
                          </div>
                      )}
  
                      <div className="flex gap-3">
                          <button
                              onClick={handleEmailPDF}
                              disabled={!email || emailStatus === 'Sending...'}
                              className="flex-1 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.05),inset_1px_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-300"
                          >
                              {emailStatus === 'Sending...' ? 'Sending...' : 'Send PDF Report'}
                          </button>
                          <button
                              onClick={() => { setShowEmailModal(false); setEmail(''); setEmailStatus(''); }}
                              className="flex-1 bg-gradient-to-br from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white px-4 py-3 rounded-xl font-medium shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.05),inset_1px_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-300"
                          >
                              Cancel
                          </button>
                      </div>
                      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
          {/* Report Detail Modal */}
          <AnimatePresence>
  {selectedReport && !showEmailModal && (
    <motion.div
    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
    animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
    transition={{ duration: 0.18 }}
    onClick={() => setSelectedReport(null)}
  >
                  <motion.div
        className="bg-gray-900 rounded-2xl shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.05)] max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
  animate={{ scale: 1, opacity: 1, y: 0 }}
  exit={{ scale: 0.95, opacity: 0, y: 20 }}
  transition={{ duration: 0.24, ease: "easeOut" 
        }}
        onClick={e => e.stopPropagation()}
      >
                  <div className="relative p-6 pr-14 border-b border-gray-800 bg-gray-900 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-2 gap-x-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white break-words">
            Report for <span className="text-blue-400">{selectedReport.url}</span>
          </h2>
        </div>
        <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
          <button
            onClick={handleGeneratePDF}
            disabled={pdfLoading}
            className="bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-all duration-300"
          >
            <BiSolidDownload className="inline-block text-xl align-middle mr-2" />
            {pdfLoading ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-all duration-300"
          >
            <MdAttachEmail className="inline-block text-2xl align-middle mr-2" />
            Email PDF
          </button>
        </div>
        <button
          onClick={() => setSelectedReport(null)}
          className="absolute top-5 sm:top-6 right-2 sm:right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors w-8 h-8 rounded-lg flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>
      </div>
                      <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                          {/* Summary Stats */}
                          <div className="bg-gray-900 rounded-xl p-6 mb-6 shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)]">
                              <div className="grid grid-cols-2 gap-6">
                                  <div className="text-center">
                                      <p className="text-gray-400 text-sm mb-2">Total Issues</p>
                                      <p className="text-3xl font-bold text-red-400">{selectedReport.totalIssues || selectedReport.violations?.length || 0}</p>
                                  </div>
                                  <div className="text-center">
                                      <p className="text-gray-400 text-sm mb-2">Passes</p>
                                      <p className="text-3xl font-bold text-green-400">{selectedReport.passes || 0}</p>
                                  </div>
                              </div>
                          </div>
  
                          {/* Violations List */}
                          {selectedReport.violations?.length > 0 ? (
                              <motion.div 
    className="space-y-6"
    variants={containerVariants}
    initial="hidden"
    animate="show"
  >
                                  {selectedReport.violations.map((violation, vIndex) => (
                                     <motion.div 
                                     key={vIndex} 
                                     className="bg-gray-900 rounded-xl p-6 shadow-[6px_6px_12px_rgba(0,0,0,0.4),-6px_-6px_12px_rgba(255,255,255,0.05)]"
                                     variants={itemVariants}
                                   >
                                          <div className="flex items-center gap-3 mb-4">
                                              <h3 className="font-bold text-white text-lg break-words">{violation.description}</h3>
                                              <span className={`text-xs px-3 py-1 rounded-lg font-medium shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] flex-shrink-0 ${
                                                  violation.impact === 'critical' ? 'bg-red-500 text-white' :
                                                  violation.impact === 'serious' ? 'bg-orange-500 text-white' :
                                                  violation.impact === 'moderate' ? 'bg-yellow-500 text-gray-900' :
                                                  'bg-blue-500 text-white'
                                              }`}>
                                                  {violation.impact}
                                              </span>
                                          </div>
  
                                          <p className="text-gray-300 text-sm mb-4 leading-relaxed break-words">{violation.help}</p>
                                          <a 
                                              href={violation.helpUrl} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors break-all"
                                          >
                                              Learn more →
                                          </a>
  
                                          {violation.nodes?.map((node, nIndex) => (
                                              <div key={nIndex} className="mt-6 bg-gray-900 rounded-xl p-4 shadow-[4px_4px_8px_rgba(0,0,0,0.4),-4px_-4px_8px_rgba(255,255,255,0.05)]">
                                                  <p className="text-sm text-gray-300 mb-3 font-bold break-words">
                                                      <strong>Issue:</strong> {node.failureSummary}
                                                  </p>
                                                  <div className="flex items-start gap-3">
                                                      <pre className="bg-gray-900 p-4 rounded-lg border-none text-xs text-gray-300 flex-1 overflow-x-auto shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] whitespace-pre-wrap break-all">
                                                          {node.html}
                                                      </pre>
                                                      <button 
                                                          onClick={() => handleCopy(node.html)} 
                                                          className="bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-[inset_-1px_-1px_2px_rgba(255,255,255,0.05),inset_1px_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.3)] active:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 flex-shrink-0"
                                                      >
                                                          Copy
                                                      </button>
                                                  </div>
                                              </div>
                                          ))}
                                      </motion.div>
                                  ))}
                              </motion.div>
                          ) : (
                            <motion.div 
                            className="text-center py-16 text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                                  <div className="text-6xl mb-6">✅</div>
                                  <p className="text-xl font-bold mb-3">Great news!</p>
                                  <p className="text-gray-500">No accessibility violations found on this website.</p>
                                  </motion.div>
                          )}
                      </div>
                      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
</motion.div>
  );
};
    
export default Dashboard;   