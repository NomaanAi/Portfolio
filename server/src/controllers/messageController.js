import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.user ? req.user._id : null;

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      user: userId,
    });

    // If user is logged in, add message to user's messages array
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { messages: newMessage._id },
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        message: newMessage,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get all messages (admin only)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get messages for logged-in user
export const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Update message status (admin only)
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'No message found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        message,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Delete message (admin only)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: 'No message found with that ID',
      });
    }

    // Remove message reference from user
    if (message.user) {
      await User.findByIdAndUpdate(message.user, {
        $pull: { messages: message._id },
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get dashboard stats (admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    const repliedMessages = await Message.countDocuments({ status: 'replied' });

    // Get messages per user
    const messagesByUser = await User.aggregate([
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'user',
          as: 'userMessages',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          messageCount: { $size: '$userMessages' },
        },
      },
      { $sort: { messageCount: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalMessages,
          unreadMessages,
          repliedMessages,
          messagesByUser,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
