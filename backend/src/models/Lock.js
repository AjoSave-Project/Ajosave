const mongoose = require('mongoose');

const LockSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  label: {
    type: String,
    trim: true,
    maxlength: [100, 'Label cannot exceed 100 characters']
  },
  releaseType: {
    type: String,
    enum: { values: ['date', 'manual'], message: 'releaseType must be date or manual' },
    required: [true, 'Release type is required']
  },
  releaseDate: {
    type: Date,
    required: function () { return this.releaseType === 'date'; }
  },
  status: {
    type: String,
    enum: ['active', 'released'],
    default: 'active',
    index: true
  },
  releasedAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { transform: (doc, ret) => { delete ret.__v; return ret; } }
});

LockSchema.index({ userId: 1, status: 1 });
LockSchema.index({ status: 1, releaseType: 1, releaseDate: 1 });

module.exports = mongoose.model('Lock', LockSchema);
