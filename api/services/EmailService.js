import nodemailer from 'nodemailer';

class EmailService {

    async sendEmail(email, name, token, typeMessage) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const message = await this.MessageEmail(name, typeMessage, token)

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: message.subject,
                html: message.body
            });

            console.log(`E-mail de ${typeMessage.toUpperCase()} enviado para ${email}`)
            return { success: true, message: 'E-mail enviado com sucesso' };

        } catch (err) {
            console.log(err.message);
            return { success: false, message: 'Erro ao enviar e-mail' };
        }
    }

    async MessageEmail(name, typeMessage, token) {
        try {

            let linkOk = ''

            if (typeMessage == 'cadastro') {
                linkOk = `${process.env.IP_FRONT}/confirm-email?token=${token}`;
                return {
                    subject: 'Confirmar cadastro',
                    body: `<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5" style="padding: 30px 0;">
                        <tr>
                            <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="padding: 40px; border-radius: 8px; font-family: Arial, sans-serif;">
                                <tr>
                                <td style="font-size: 18px; color: #333333;">
                                    <h3 style="margin-top: 0;">Olá ${name},</h3>
                                    <p style="margin: 20px 0;">
                                    Clique no botão abaixo para confirmar seu cadastro:
                                    </p>
                                    <p style="text-align: center; margin: 30px 0;">
                                    <a href="${linkOk}" target="_blank" style="background-color: #007BFF; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-size: 16px;">
                                        Confirmar cadastro
                                    </a>
                                    </p>
                                    <p style="margin-top: 40px; font-size: 14px; color: #777777;">
                                    Este link expira em 15 minutos.
                                    </p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    `
                }
            }

            if (typeMessage == 'recovery') {
                linkOk = `${process.env.IP_FRONT}/recovery-password?token=${token}`;
                return {
                    subject: 'Recuperação de senha',
                    body: `<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5" style="padding: 30px 0;">
                                <tr>
                                    <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="padding: 40px; border-radius: 8px; font-family: Arial, sans-serif;">
                                        <tr>
                                        <td style="font-size: 18px; color: #333333;">
                                            <h3 style="margin-top: 0;">Olá ${name},</h3>
                                            <p style="margin: 20px 0;">
                                            Recebemos uma solicitação para redefinir sua senha. Se foi você, clique no botão abaixo para criar uma nova senha:
                                            </p>
                                            <p style="text-align: center; margin: 30px 0;">
                                            <a href="${linkOk}" target="_blank" style="background-color: #28a745; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-size: 16px;">
                                                Redefinir senha
                                            </a>
                                            </p>
                                            <p style="margin: 20px 0;">
                                            Se você não solicitou essa alteração, ignore este e-mail.
                                            </p>
                                            <p style="margin-top: 40px; font-size: 14px; color: #777777;">
                                            Este link expira em 15 minutos por motivos de segurança.
                                            </p>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                            </table>

                        `
                }
            }            

            return {subject: '', link: '', body: ''}
        }
        catch (err) {
            console.log(err.message);
            return { success: false, message: 'Erro ao enviar e-mail' };
        }
    }
}

export default new EmailService();
