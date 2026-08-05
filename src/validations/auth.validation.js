import Joi from 'joi';

export const login = {
	body: Joi.object().keys({
		userName: Joi.string().required(),
		passWord: Joi.string().required(),
	}),
};
