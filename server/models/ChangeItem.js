const mongoose = require('mongoose');

const changeItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['feature', 'bugfix', 'improvement', 'breaking', 'deprecation', 'security'],
        message: '{VALUE} is not a valid type',
      },
    },
    version: {
      type: String,
      required: [true, 'Version is required'],
      validate: {
        validator: function (v) {
          return /^\d+\.\d+\.\d+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid semver version (e.g. 1.0.0)`,
      },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['planned', 'in-progress', 'completed', 'released'],
        message: '{VALUE} is not a valid status',
      },
      default: 'planned',
    },
    author: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
changeItemSchema.index({ version: 1, status: 1 });
changeItemSchema.index({ type: 1 });

module.exports = mongoose.model('ChangeItem', changeItemSchema);
