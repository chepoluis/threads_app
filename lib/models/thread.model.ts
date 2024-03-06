import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: String,
    ref: 'User',
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [ // Allow nested threads
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread',
    }
  ]
});

/**
 * Se hace de la siguiente manera porque la primera vez el schema no existe por lo que 
 * se tiene que crear, y la siguintes veces llamara mongoose.models.Thread
 */
const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;
