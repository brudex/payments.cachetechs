const Joi = require('joi');
const logger = require('./logger');
const { PAYMENT_MODES } = require('../constants/payment');

const validation = {
    validateUserInput: {
        register: (data) => {
            const schema = Joi.object({
                fullName: Joi.string().required().min(2).max(100),
                companyName: Joi.string().required().min(2).max(100),
                email: Joi.string().email().required(),
                phoneNumber: Joi.string().allow('').optional(),
                password: Joi.string().min(6).required(),
                confirmPassword: Joi.string().valid(Joi.ref('password')).required()
                    .messages({ 'any.only': 'Passwords do not match' })
            });

            return schema.validate(data);
        },

        login: (data) => {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                remember: Joi.boolean().optional()
            });

            return schema.validate(data);
        }
    },

    validateAppInput: (data) => {
        logger.info('Validating app input:', { data });

        const schema = Joi.object({
            appName: Joi.string().required().min(3).max(100),
            paymentModes: Joi.array().items(
                Joi.string().valid(...Object.values(PAYMENT_MODES))
            ).min(1).required(),
            shouldSendCallback: Joi.boolean().required(),
            callbackUrl: Joi.string().uri().when('shouldSendCallback', {
                is: true,
                then: Joi.required(),
                otherwise: Joi.optional()
            })
        });

        const result = schema.validate(data);
        
        if (result.error) {
            logger.error('App validation failed:', {
                error: result.error.details,
                invalidValue: result.error.details[0].context.value,
                path: result.error.details[0].path
            });
        }

        return result;
    }
};

module.exports = validation;