package com.project.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.app.models.DevoirRendu;

@Repository
public interface DevoirRenduRepository extends JpaRepository <DevoirRendu, Long>{
	List<DevoirRendu> findByDevoir_IdDevoir(Integer idDevoir);
	@Query("SELECT dr FROM DevoirRendu dr " +
		       "WHERE dr.devoir.cours.idCours = :idCours " +
		       "AND dr.etudiant.id = :idEtudiant")
		List<DevoirRendu> findDevoirRenduByCoursAndEtudiant(Long idCours, Long idEtudiant);

}