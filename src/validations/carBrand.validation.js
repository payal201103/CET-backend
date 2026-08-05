import Joi from 'joi';

export const createCarBrand = {
	body: Joi.object().keys({
		brandName: Joi.string().required().max(100),
	}),
};

export const updateCarBrand = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		brandName: Joi.string().required().max(100),
	}),
};
