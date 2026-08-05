import { STATUS_CODES } from './statusCodes.js';

class ResponseHandler {
	constructor(req, res) {
		this.req = req;
		this.res = res;
	}

	sender(code, message, data, sendData = true) {
		this.res.status(code).json({ message, data: sendData ? data : {} });
	}

	custom(code, message, data) {
		this.sender(code, message, data);
	}

	success(data, message) {
		this.sender(STATUS_CODES.SUCCESS, message || 'Success', data);
	}

	created(data, message) {
		this.sender(STATUS_CODES.CREATED, message || 'Created Successfully', data);
	}

	badRequest(data, message) {
		this.sender(STATUS_CODES.BAD_REQUEST, message || 'Bad Request', data);
	}

	unauthorized(data, message) {
		this.sender(STATUS_CODES.UNAUTHORIZED, message || 'Unauthorized', data);
	}

	forbidden(data, message) {
		this.sender(STATUS_CODES.FORBIDDEN, message || 'Forbidden', data);
	}

	notFound(data, message) {
		this.sender(STATUS_CODES.NOT_FOUND, message || 'Requested resource not found!', data);
	}

	notAllowed(data, message) {
		this.sender(STATUS_CODES.NOT_ALLOWED, message || 'Method is not allowed!', data);
	}

	conflict(data, message) {
		this.sender(STATUS_CODES.CONFLICT, message || 'Provided information already exist!', data);
	}

	preconditionFailed(data, message) {
		this.sender(
			STATUS_CODES.PRECONDITION_FAILED,
			message || 'Please complete other steps first',
			data
		);
	}

	validationError(data, message) {
		this.sender(STATUS_CODES.VALIDATION_ERROR, message || 'Validation error!', data);
	}

	serverError(data, message, sendData = false) {
		this.sender(STATUS_CODES.SERVER_ERROR, message || 'Internal Server Error!', data, sendData);
	}
}

export default ResponseHandler;
