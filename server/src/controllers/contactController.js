import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // 1) Check if all required fields are provided
  if (!name || !email || !subject || !message) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // 2) Send email to admin
  try {
    await new Email({
      email: process.env.ADMIN_EMAIL,
      name: 'Admin',
    }).sendContactForm({
      name,
      email,
      subject,
      message,
    });

    // 3) Send confirmation email to user
    await new Email({
      email,
      name,
    }).send('contactConfirmation', 'Thank you for contacting us!', {
      name,
      message: 'We have received your message and will get back to you soon.',
    });

    // 4) Send success response
    res.status(200).json({
      status: 'success',
      message: 'Thank you for your message. We will get back to you soon!',
    });
  } catch (err) {
    console.error('Error sending contact email:', err);
    return next(
      new AppError('There was an error sending your message. Please try again later.', 500)
    );
  }
});
