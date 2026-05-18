const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  performanceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  experience: {
    type: Number, // In years
    required: true
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
