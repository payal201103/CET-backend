import Joi from 'joi';

export const resolveRejectedRequest = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		videoType: Joi.string().valid('Reel', 'YouTube').required(),
		assignedBy: Joi.string().allow('', null).max(100),
	}),
};

export const updatePendingRequest = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		isActive: Joi.boolean().required(),
	}),
};
