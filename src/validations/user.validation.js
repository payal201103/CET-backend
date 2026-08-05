import Joi from 'joi';

export const createUser = {
	body: Joi.object().keys({
		firstName: Joi.string().required().max(100),
		lastName: Joi.string().required().max(100),
		username: Joi.string().required().max(100),
		password: Joi.string().required().max(255),
		role: Joi.string().required().max(50),
	}),
};
