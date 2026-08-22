import axios from 'axios';
import logger from './logger.js';

/**
 * Send real SMS to mobile numbers via Fast2SMS, Twilio, or Msg91
 * @param {string} mobileNumber 10-digit Indian mobile number
 * @param {string} otpCode 6-digit OTP code
 */
export async function sendRealSms(mobileNumber, otpCode) {
	const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);

	const fast2smsKey = process.env.FAST2SMS_API_KEY;
	const twilioSid = process.env.TWILIO_ACCOUNT_SID;
	const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
	const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

	// 1. Fast2SMS Integration (Popular Indian SMS Gateway)
	if (fast2smsKey) {
		try {
			const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
				params: {
					authorization: fast2smsKey,
					variables_values: otpCode,
					route: 'otp',
					numbers: cleanMobile,
				},
				headers: {
					'cache-control': 'no-cache',
				},
			});
			logger.info(`Real SMS sent via Fast2SMS to ${cleanMobile}:`, response.data);
			return { success: true, provider: 'Fast2SMS', data: response.data };
		} catch (err) {
			logger.error(`Fast2SMS Error sending to ${cleanMobile}:`, err.response?.data || err.message);
		}
	}

	// 2. Twilio Integration (Global SMS Gateway)
	if (twilioSid && twilioAuthToken && twilioFrom) {
		try {
			const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
			const response = await axios.post(
				`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
				new URLSearchParams({
					To: `+91${cleanMobile}`,
					From: twilioFrom,
					Body: `Your OTP for EXOTIC CRM password reset is: ${otpCode}. Valid for 10 minutes.`,
				}).toString(),
				{
					headers: {
						Authorization: `Basic ${auth}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			logger.info(`Real SMS sent via Twilio to +91${cleanMobile}:`, response.data);
			return { success: true, provider: 'Twilio', data: response.data };
		} catch (err) {
			logger.error(`Twilio Error sending to +91${cleanMobile}:`, err.response?.data || err.message);
		}
	}

	// 3. Textbelt Free API (Free Instant SMS test fallback)
	try {
		const textbeltRes = await axios.post('https://textbelt.com/text', {
			phone: `+91${cleanMobile}`,
			message: `EXOTIC CRM OTP: ${otpCode}. Valid for 10 minutes.`,
			key: 'textbelt',
		});
		if (textbeltRes.data && textbeltRes.data.success) {
			logger.info(`Real SMS sent via Textbelt to +91${cleanMobile}:`, textbeltRes.data);
			return { success: true, provider: 'Textbelt', data: textbeltRes.data };
		}
	} catch (err) {
		logger.debug(`Textbelt Free SMS info for ${cleanMobile}:`, err.message);
	}

	// Fallback logging
	logger.warn(`[SMS Real Mode] Real SMS to ${cleanMobile} ready! Add FAST2SMS_API_KEY to .env for unlimited delivery.`);
	return { success: false, reason: 'FAST2SMS_API_KEY or TWILIO credentials missing in .env' };
}

export default sendRealSms;
