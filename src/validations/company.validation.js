import Joi from 'joi';

export const createCompany = {
	body: Joi.object().keys({
		companyName: Joi.string().required().max(150),
		mobileNumber: Joi.string()
			.required()
			.pattern(/^\d{10}$/),
		gstin: Joi.string().allow('', null).max(15),
		address: Joi.string().allow('', null).max(500),
	}),
};
