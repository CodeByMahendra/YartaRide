import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Sends an OTP via WhatsApp Cloud API
 * @param phone Phone number with country code (e.g., 919876543210)
 * @param otp 6-digit verification code
 */
export const sendWhatsAppOTP = async (phone: string, otp: string) => {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.warn('⚠️ WhatsApp credentials missing. Falling back to console log for development.');
        console.log(`[DEV MODE] WhatsApp OTP for ${phone}: ${otp}`);
        return { success: true, mode: 'dev' };
    }

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phone.startsWith('+') ? phone.substring(1) : phone,
                type: "template",
                template: {
                    name: "otp_verification", // Ensure you have this template approved in Meta Dashboard
                    language: {
                        code: "en_US"
                    },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                {
                                    type: "text",
                                    text: otp
                                }
                            ]
                        },
                        {
                            type: "button",
                            sub_type: "url",
                            index: "0",
                            parameters: [
                                {
                                    type: "text",
                                    text: otp
                                }
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return { success: true, data: response.data, mode: 'prod' };
    } catch (error: any) {
        console.error('WhatsApp API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Failed to send WhatsApp message');
    }
};
