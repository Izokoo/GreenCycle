package com.greencycle.greencycle.repository;

import com.greencycle.greencycle.model.Collecte;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CollecteRepository extends JpaRepository<Collecte, Long> {

    // collectes d’un citoyen
    List<Collecte> findByCitoyenId(Long citoyenId);

    // collectes d’un collecteur
    List<Collecte> findByCollecteurId(Long collecteurId);

    // filtrer par statut
    List<Collecte> findByStatut(String statut);
}