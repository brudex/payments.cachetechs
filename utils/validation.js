const Joi = require('joi');

const validation = {
    validateAppInput: (data) => {
        const schema = Joi.object({
            appName: Joi.string().required().min(3).max(100),
            logoUrl: Joi.string().uri().allow('').optional(),
            paymentModes: Joi.array().items(Joi.string().valid('card', 'wallet', 'crypto')).min(1),
            shouldSendClientCallback: Joi.boolean().default(false),
            appCallbackUrl: Joi.string().uri().when('shouldSendClientCallback', {
                is: true,
                then: Joi.required(),
                otherwise: Joi.optional()
            })
        });

        return schema.validate(data);
    },

    validateUserInput: {
        login: (data) => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                remember: Joi.boolean().optional()
            });
            return schema.validate(data);
        },

        register: (data) => {
            const schema = Joi.object({
                fullName: Joi.string().required().min(2).max(100),
                companyName: Joi.string().required().min(2).max(100),
                email: Joi.string().email().required(),
                phoneNumber: Joi.string().optional(),
                password: Joi.string().min(6).required(),
                confirmPassword: Joi.ref('password')
            });
            return schema.validate(data);
        }
    }
};

module.exports = validation;