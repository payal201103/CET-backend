import Joi from 'joi';

export const createCustomer = {
	body: Joi.object().keys({
		customerName: Joi.string().required().max(150),
		mobileNumber: Joi.string()
			.required()
			.pattern(/^\d{10}$/),
		emailId: Joi.string().allow('', null).email().max(100),
		gstNumber: Joi.string().allow('', null).max(15),
	}),
};

export const updateCustomer = {
	params: Joi.object().keys({
		id: Joi.number().integer().required(),
	}),
	body: Joi.object().keys({
		customerName: Joi.string().required().max(150),
		mobileNumber: Joi.string()
			.required()
			.pattern(/^\d{10}$/),
		emailId: Joi.string().allow('', null).email().max(100),
		gstNumber: Joi.string().allow('', null).max(15),
	}),
};
