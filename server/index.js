const express = require('express');
const mongoose = require('mongoose');              
require('dotenv').config();      
const cors = require('cors');

const helmet = require('helmet');

const analyzeRoutes = require('./routes/analysis');
const reportRoutes = require('./routes/report');
const pdfRoutes = require('./routes/pdf');

const app = express(); 

const allowedOrigins = [
    'https://accessibility-analyzer-v3.vercel.app',
    'http://localhost:4000'
  ];
  
  app.use(cors({
    origin: allowedOrigins
  }));

app.use(helmet());
app.use(express.json({ limit: '10mb'}));

const connectDB = async () => {        
    try{                        
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('MongoDB connected');      
    } catch(err){                                       
        console.error('MongoDB Connection Failed: ', err.message);         
        process.exit(1);         
    }
};

connectDB();    

app.use('/api', reportRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', pdfRoutes);

app.listen(process.env.PORT || 4000, () => {        
    console.log(`Server is running on port ${process.env.PORT || 4000}`);    
});

