package com.project.app.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Lob;

public class DevoirRenduDetails {
	private Long idDevoir;
    private String typedevoir;
    private String description;
    private float ponderation;
    private String bareme;
    private Date dateLimite;
    private String statut;
    private Integer maxDocuments;
    private String commentaire;
    private Float note;

	
	public void setIdDevoir(Long idDevoir) {
		this.idDevoir = idDevoir;
	}
	public String getTypedevoir() {
		return typedevoir;
	}
	public void setTypedevoir(String typedevoir) {
		this.typedevoir = typedevoir;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public float getPonderation() {
		return ponderation;
	}
	public void setPonderation(float ponderation) {
		this.ponderation = ponderation;
	}
	public String getBareme() {
		return bareme;
	}
	public void setBareme(String bareme) {
		this.bareme = bareme;
	}
	public Date getDateLimite() {
		return dateLimite;
	}
	public void setDateLimite(Date dateLimite) {
		this.dateLimite = dateLimite;
	}
	public String getStatut() {
		return statut;
	}
	public void setStatut(String statut) {
		this.statut = statut;
	}
	public Integer getMaxDocuments() {
		return maxDocuments;
	}
	public void setMaxDocuments(Integer maxDocuments) {
		this.maxDocuments = maxDocuments;
	}
	public String getCommentaire() {
		return commentaire;
	}
	public void setCommentaire(String commentaire) {
		this.commentaire = commentaire;
	}
	public Float getNote() {
		return note;
	}
	public void setNote(Float note) {
		this.note = note;
	}
	
	
	

}