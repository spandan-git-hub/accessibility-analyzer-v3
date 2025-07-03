const express = require('express');
const ReportModel = require('../models/report'); 

const router = express.Router();

router.get('/reports', async (req, res) => {      
    try{                                
        const allReports = await ReportModel.find().sort({ createdAt: -1 });      
        res.status(200).json(allReports);      
    } catch (err){
        res.status(500).json({ error: 'Failed to fetch reports'});
    }
});

router.post('/reports', async (req, res) => {
    try{
    const report = new ReportModel(req.body);                 
    await report.save();                  
    res.status(201).json(report);
    } catch(err){    
        res.status(500).json({ error: 'Failed to create report'});
    }
});

// router.get('/reports/:id', async (req, res) => {
//     try {
//         const report = await ReportModel.findById(req.params.id);
//         if (!report) {
//             return res.status(404).json({ error: 'Report not found' });
//         }
//         res.json(report);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch report' });
//     }
// });

// router.put('/reports/:id', async (req, res) => {
//   try {
//       const report = await ReportModel.findByIdAndUpdate( 
//           req.params.id, 
//           req.body, 
//           { new: true, runValidators: true }
//       );
//       if (!report) {
//           return res.status(404).json({ error: 'Report not found' });
//       }
//       res.json(report);
//   } catch (err) {
//       res.status(500).json({ error: 'Failed to update report' });
//   }
// });

router.delete('/reports/:id', async (req, res) => {
  try {
      const report = await ReportModel.findByIdAndDelete(req.params.id);
      if (!report) {
          return res.status(404).json({ error: 'Report not found' });
      }
      res.json({ message: 'Report deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;