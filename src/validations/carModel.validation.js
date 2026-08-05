import Joi from 'joi';

export const createCarModel = {
	body: Joi.object().keys({
		brandId: Joi.number().integer().required(),
		modelName: Joi.string().required().max(100),
	}),
};

export const updateCarModel = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		brandId: Joi.number().integer().required(),
		modelName: Joi.string().required().max(100),
	}),
};
