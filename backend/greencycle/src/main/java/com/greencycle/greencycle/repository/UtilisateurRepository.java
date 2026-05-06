package com.greencycle.greencycle.repository;

import com.greencycle.greencycle.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // trouver un utilisateur par email (unicité)
    Optional<Utilisateur> findByEmail(String email);

    // leaderboard trié par points décroissant
    List<Utilisateur> findAllByOrderByPointsEcologiquesDesc();

    // Verif
    boolean existsByEmail(String email);
}