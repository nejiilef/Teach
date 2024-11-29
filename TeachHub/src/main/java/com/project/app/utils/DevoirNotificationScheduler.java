package com.project.app.utils;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.project.app.dto.EvaluationDTO;
import com.project.app.models.DevoirRendu;
import com.project.app.models.Etudiant;
import com.project.app.repository.DevoirRenduRepository;
import com.project.app.repository.DevoirRepository;
import com.project.app.services.jwt.DevoirRenduService;
import com.project.app.services.jwt.EmailService;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DevoirNotificationScheduler {

    @Autowired
    private DevoirRepository devoirRepository; // Repos pour récupérer les devoirs
    @Autowired
    private EmailService emailService; // Service d'envoi d'email
    @Autowired
    private DevoirRenduRepository devoirRenduRepository;

    @Autowired
    private DevoirRenduService devoirRenduService;
    @Scheduled(cron = "0 0 22 * * ?")
    public void sendReminderEmails() {
    	 System.out.println("La tâche cron est exécutée à 22h00");
    	    LocalDate today = LocalDate.now();  // La date actuelle sans heure

    	    devoirRepository.findAll().forEach(devoir -> {
    	        System.out.println(today);
    	        
    	        // Convertir Date en LocalDate
    	        Date dateLimite = devoir.getDateLimite();
    	        LocalDate localDateLimite = dateLimite.toInstant()
    	                                              .atZone(ZoneId.systemDefault())
    	                                              .toLocalDate();  // Conversion en LocalDate sans l'heure

    	        System.out.println(localDateLimite);

    	        if (localDateLimite.equals(today)) {  // Vérifier uniquement la date
    	            
    	            // Initialize the sousGroupes collection before accessing it
    	            Hibernate.initialize(devoir.getSousGroupes());

    	            Set<Etudiant> etudiantsToNotify = new HashSet<>();

    	            
    	            if (devoir.getSousGroupes().isEmpty()) {
    	                
    	                devoir.getCours().getStudents().forEach(e ->etudiantsToNotify.add(e)
    	                
    	                );
    	            } else {
    	                devoir.getSousGroupes().forEach(sg -> sg.getEtudiants().forEach(e -> etudiantsToNotify.add(e)));
    	            }

    	            // Envoi d'emails à tous les étudiants récupérés
    	            etudiantsToNotify.forEach(etudiant -> {
    	                System.out.println(etudiant.getEmail());
    	                String subject = "Rappel: Devoir à rendre bientôt";
    	                String text = "Bonjour " + etudiant.getNom() + ",\n\n" +
    	                              "Il vous reste 2 heures pour rendre le devoir intitulé : " + devoir.getDescription() +
    	                              ".\nLa date limite est : " + devoir.getDateLimite() + ".\n\n" +
    	                              "Cordialement,\nL'équipe TeachHub";
    	                emailService.sendReminder(etudiant.getEmail(), subject, text);
    	            });
    	        }
    	    });
    }
    @Scheduled(cron = "0 25 10 * * ?")
    public void Evaluate() {
    	 System.out.println("La tâche cron est exécutée à 22h00");
    	    LocalDate today = LocalDate.now();  // La date actuelle sans heure
    	    devoirRepository.findAll().forEach(devoir -> {
    	        System.out.println(today);
    	        
    	        // Convertir Date en LocalDate
    	        Date dateLimite = devoir.getDateLimite();
    	        LocalDate localDateLimite = dateLimite.toInstant()
    	                                              .atZone(ZoneId.systemDefault())
    	                                              .toLocalDate();  // Conversion en LocalDate sans l'heure

    	        System.out.println(localDateLimite);

    	        if (localDateLimite.equals(today)) {  // Vérifier uniquement la date
    	            
    	            // Initialize the sousGroupes collection before accessing it
    	            Hibernate.initialize(devoir.getSousGroupes());

    	            Set<Etudiant> etudiantsToEvaluate = new HashSet<>();

    	            
    	            if (devoir.getSousGroupes().isEmpty()) {
    	                
    	                devoir.getCours().getStudents().forEach(e ->etudiantsToEvaluate.add(e)
    	                
    	                );
    	            } else {
    	                devoir.getSousGroupes().forEach(sg -> sg.getEtudiants().forEach(e -> etudiantsToEvaluate.add(e)));
    	            }

    	            // Envoi d'emails à tous les étudiants récupérés
    	            
    	            	this.devoirRenduRepository.findAll().forEach(dr->{
    	            		if(dr.getDevoir().getIdDevoir()==devoir.getIdDevoir()) {
    	            			etudiantsToEvaluate.remove(dr.getEtudiant());
    	            		}
    	            });
    	            	etudiantsToEvaluate.forEach(e->{
    	            		
    	            		DevoirRendu r=new DevoirRendu();
    	            		r.setDevoir(devoir);
    	            		r.setEtudiant(e);
    	            		DevoirRendu dr=this.devoirRenduRepository.save(r);
    	            		EvaluationDTO eval=new EvaluationDTO();
    	            		eval.setIdDevoirRendu(dr.getIdDevoirRendu());
    	            		eval.setNote(0.0f);
    	            		this.devoirRenduService.evaluerDevoir(eval);
    	            	});
    	        }
    	    });
    	    
    }
}
