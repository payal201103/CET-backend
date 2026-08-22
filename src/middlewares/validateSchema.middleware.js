const validateSchema =
	(schema = {}) =>
	(req, res, next) => {
		let errorMessage = '';

		Object.keys(schema).forEach((key) => {
			if (!req[key]) errorMessage += `Please provide ${key}`;

			const schemaValue = schema[key];

			if (req[key] && schemaValue) {
				const { error, value } = schemaValue
					.prefs({ errors: { label: 'key' }, abortEarly: false })
					.validate(req[key]);

				if (error) {
					errorMessage += error.details.map((details) => details.message).join(', ');
				} else {
					if (key === 'body') req.body = value; // overwrite body with validated value
				}
			}
		});

		if (errorMessage.length) {
			return res.handler.badRequest({}, errorMessage);
		}

		return next();
	};

export default validateSchema;
