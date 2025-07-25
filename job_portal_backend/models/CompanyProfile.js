
const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
    owner_email : { type: String, trim: true, lowercase: true },
    companyName: { type: String,  trim: true },
    companyDescription: { type: String,  trim: true },
    companyLogo: { type: String,  },
    websiteUrl: { type: String,  trim: true },
    companyEmail: { type: String,  trim: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
    day : Number,
    month : Number,
    year : Number,
    employeeStrength: { type: String,  },
    location: { type: String,  },
    industry: { type: String,  },
    technology: { type: String,  },
    aboutCompany: { type: String,  trim: true },
    
    facebookUrl: { type: String, trim: true },
    linkedInUrl: { type: String, trim: true },
    instagramUrl: { type: String, trim: true },

    externalApplyUrl: { type: String, trim: true },
})

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);