import Joi from 'joi';

export const createJobCard = {
	body: Joi.object().keys({
		customerId: Joi.number().integer().required(),
		brandId: Joi.number().integer().required(),
		modelId: Joi.number().integer().required(),
		carNumber: Joi.string().allow('', null).max(50),
		carColor: Joi.string().allow('', null).max(50),
		services: Joi.array().items(Joi.string()).required(),
		bookingDate: Joi.string().required(),
		deliveryDate: Joi.string().required(),
		specialNotes: Joi.string().allow('', null),
		status: Joi.string().allow('', null).max(50),
	}),
};

export const updateJobCard = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		brandId: Joi.number().integer().required(),
		modelId: Joi.number().integer().required(),
		carNumber: Joi.string().allow('', null).max(50),
		carColor: Joi.string().allow('', null).max(50),
		services: Joi.array().items(Joi.string()).required(),
		bookingDate: Joi.string().required(),
		deliveryDate: Joi.string().required(),
		specialNotes: Joi.string().allow('', null),
		status: Joi.string().allow('', null).max(50),
	}),
};
