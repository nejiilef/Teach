package com.project.app.services.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {
	@Autowired
    private JavaMailSender mailSender;
	
	private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
	public void sendInvitationEmail(String to, String inviteLink, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Invitation à rejoindre un cours");
            message.setText("Vous avez été invité à rejoindre un cours. Utilisez le code suivant : " + code +
                           "\nOu cliquez sur le lien pour rejoindre : " + inviteLink);

            mailSender.send(message);
            System.out.println("Email envoyé avec succès à : " + to);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'e-mail : " + e.getMessage());
            e.printStackTrace();
        }
    }

	public void sendReminder(String to, String subject, String text) {
        logger.info("Tentative d'envoi d'un email à : {}", to);  // Log avant l'envoi
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("no-reply@teachhub.com"); // Ajustez en fonction de votre configuration
        
        try {
            mailSender.send(message);
            logger.info("Email envoyé avec succès à : {}", to);  // Log après l'envoi réussi
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email à : {}", to, e);  // Log en cas d'erreur
        }
    }
    

}
