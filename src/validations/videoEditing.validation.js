import Joi from 'joi';

export const updatePendingRequest = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		isActive: Joi.boolean().required(),
	}),
};
