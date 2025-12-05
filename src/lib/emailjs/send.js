import emailjs from '@emailjs/browser'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/**
 * Send email notification when a contact form is submitted
 * @param {object} formData - Contact form data (name, surname, email, description)
 * @param {array} imageUrls - Array of Cloudinary image URLs (max 3)
 * @returns {Promise<{success, error}>}
 */
export async function sendContactEmail(formData, imageUrls = []) {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
        console.error('EmailJS Error: Missing environment variables. Check .env file.', {
            serviceId: !!serviceId,
            templateId: !!templateId,
            publicKey: !!publicKey
        });
        return { success: false, error: 'Configuration missing' };
    }

    try {
        // Genera HTML per le immagini
        let imagesHtml = '';
        if (imageUrls && imageUrls.length > 0) {
            imagesHtml = `
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td style="padding: 10px 0;">
                            ${imageUrls.map((url, index) => `
                                <div style="margin-bottom: 15px;">
                                    <img src="${url}" alt="Immagine ${index + 1}" 
                                         style="max-width: 100%; height: auto; border-radius: 8px; border: 2px solid #e5e5e5; display: block;" />
                                </div>
                            `).join('')}
                        </td>
                    </tr>
                </table>
            `;
        } else {
            imagesHtml = `
                <p style="color: #999999; font-style: italic; font-size: 14px;">
                    Nessuna immagine allegata
                </p>
            `;
        }

        const templateParams = {
            to_email: 'oltreperlaterza@gmail.com',
            from_name: formData.name || 'Anonimo',
            from_surname: formData.surname || '',
            from_email: formData.email || 'Anonimo',
            phone: formData.phone || 'Non fornito',
            message: formData.description,
            images_html: imagesHtml
        };

        const response = await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
        );

        console.log('Email sent successfully:', response);
        return { success: true, error: null };
    } catch (error) {
        console.error('EmailJS Detailed Error:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

/**
 * Create responsive HTML email template
 * @param {object} formData - Form data
 * @param {array} imageUrls - Array of image URLs
 * @returns {string} HTML content
 */
function createEmailHTML(formData, imageUrls) {
    const name = formData.name || 'Anonimo'
    const surname = formData.surname || ''
    const email = formData.email || 'Anonimo'
    const message = formData.description || ''

    // Generate image HTML
    let imagesHTML = ''
    if (imageUrls && imageUrls.length > 0) {
        imagesHTML = `
            <div style="margin-top: 20px;">
                <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Immagini allegate:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${imageUrls.map(url => `
                        <div style="flex: 1; min-width: 150px; max-width: 250px;">
                            <img src="${url}" alt="Immagine segnalazione" style="width: 100%; height: auto; border-radius: 8px; border: 2px solid #ddd;" />
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    } else {
        imagesHTML = `
            <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px; text-align: center;">
                <p style="color: #666; margin: 0; font-size: 14px;">Nessuna immagine inviata</p>
            </div>
        `
    }

    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuova Segnalazione</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #66CBFF 0%, #3faae0 100%); padding: 30px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">📩 Nuova Segnalazione</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">Andiamo Oltre - Parla con Noi</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 20px;">
                            <!-- Sender Info -->
                            <div style="margin-bottom: 25px;">
                                <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #66CBFF; padding-bottom: 8px;">Informazioni Mittente</h2>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: bold; width: 100px;">Nome:</td>
                                        <td style="padding: 8px 0; color: #333; font-size: 14px;">${name} ${surname}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-size: 14px; font-weight: bold;">Email:</td>
                                        <td style="padding: 8px 0; color: #333; font-size: 14px;">${email}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Message -->
                            <div style="margin-bottom: 25px;">
                                <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #66CBFF; padding-bottom: 8px;">Messaggio</h2>
                                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #66CBFF;">
                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                                </div>
                            </div>
                            
                            <!-- Images -->
                            ${imagesHTML}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; color: #666; font-size: 12px;">Questa email è stata generata automaticamente dal form di contatto</p>
                            <p style="margin: 5px 0 0 0; color: #66CBFF; font-size: 12px; font-weight: bold;">Andiamo Oltre © ${new Date().getFullYear()}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
    <!-- Mobile Styles -->
    <style>
        @media only screen and (max-width: 600px) {
            table[role="presentation"] {
                width: 100% !important;
            }
            .mobile-padding {
                padding: 15px !important;
            }
        }
    </style>
</body>
</html>
    `.trim()
}

/**
 * Initialize EmailJS (optional, for better performance)
 * Call this once in your app initialization
 */
export function initEmailJS() {
    if (publicKey) {
        emailjs.init(publicKey)
    }
}
