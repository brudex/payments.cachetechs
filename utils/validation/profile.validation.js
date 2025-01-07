const Joi = require('joi');

const validation = {
    validateProfileUpdate: (data) => {
        const schema = Joi.object({
            fullName: Joi.string()
                .required()
                .min(2)
                .max(100)
                .messages({
                    'string.empty': 'Full name is required',
                    'string.min': 'Full name must be at least 2 characters long',
                    'string.max': 'Full name cannot exceed 100 characters'
                }),
            companyName: Joi.string()
                .required()
                .min(2)
                .max(100)
                .messages({
                    'string.empty': 'Company name is required',
                    'string.min': 'Company name must be at least 2 characters long',
                    'string.max': 'Company name cannot exceed 100 characters'
                }),
            phoneNumber: Joi.string()
                .allow('')
                .pattern(/^\+?[1-9]\d{1,14}$/)
                .messages({
                    'string.pattern.base': 'Please enter a valid phone number'
                })
        });

        return schema.validate(data);
    },

    validatePasswordChange: (data) => {
        const schema = Joi.object({
            currentPassword: Joi.string()
                .required()
                .messages({
                    'string.empty': 'Current password is required'
                }),
            newPassword: Joi.string()
                .required()
                .min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .messages({
                    'string.empty': 'New password is required',
                    'string.min': 'Password must be at least 8 characters long',
                    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }),
            confirmPassword: Joi.string()
                .valid(Joi.ref('newPassword'))
                .required()
                .messages({
                    'any.only': 'Passwords do not match'
                })
        });

        return schema.validate(data);
    }
};

module.exports = validation;