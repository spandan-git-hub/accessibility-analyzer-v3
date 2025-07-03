const mongoose = require('mongoose');  

const reportSchema = new mongoose.Schema({  
    url: {
        type: String,
        required: true
    },
    violations: [{
        id: String,
        impact: String,
        description: String,
        help: String,
        helpUrl: String,
        nodes: [{
            html: String,
            failureSummary: String,
            codeSuggestion: String
        }]
    }],
    passes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false    
});

module.exports = mongoose.model('Report', reportSchema);   
