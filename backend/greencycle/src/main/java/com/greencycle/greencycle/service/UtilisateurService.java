package com.greencycle.greencycle.service;

import com.greencycle.greencycle.model.Utilisateur;
import com.greencycle.greencycle.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //  LEADERBOARD (top users)
    public List<Utilisateur> getLeaderboard() {
        return utilisateurRepository.findAllByOrderByPointsEcologiquesDesc();
    }

    //  REGISTER
    public Utilisateur register(Utilisateur utilisateur) {

        if (utilisateur.getEmail() == null || utilisateur.getEmail().isBlank()) {
            throw new RuntimeException("Email requis");
        }

        if (utilisateur.getMotDePasse() == null || utilisateur.getMotDePasse().isBlank()) {
            throw new RuntimeException("Mot de passe requis");
        }

        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateur.setPointsEcologiques(0);
        utilisateur.setCreatedAt(LocalDateTime.now());

        return utilisateurRepository.save(utilisateur);
    }

    // LOGIN FIX PROPRE
    public Utilisateur login(Utilisateur user) {

        if (user.getEmail() == null || user.getMotDePasse() == null) {
            throw new RuntimeException("Email et mot de passe requis");
        }

        Utilisateur u = utilisateurRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // FIX CRITIQUE (évite crash si mdp null en DB)
        if (u.getMotDePasse() == null) {
            throw new RuntimeException("Mot de passe non configuré");
        }

        if (!passwordEncoder.matches(user.getMotDePasse(), u.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return u;
    }

    // GET USER
    public Utilisateur getById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    // DEBUG
    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }
}/*package com.greencycle.greencycle.service;

import com.greencycle.greencycle.model.Utilisateur;
import com.greencycle.greencycle.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // leaderboard
    public List<Utilisateur> getLeaderboard() {
        return utilisateurRepository.findAllByOrderByPointsEcologiquesDesc();
    }

    // inscription
    public Utilisateur register(Utilisateur utilisateur) {

        if (utilisateur.getEmail() == null || utilisateur.getEmail().isEmpty()) {
            throw new RuntimeException("Email requis");
        }

        if (utilisateur.getMotDePasse() == null || utilisateur.getMotDePasse().isEmpty()) {
            throw new RuntimeException("Mot de passe requis");
        }

        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // HASH PASSWORD
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));

        utilisateur.setPointsEcologiques(0);
        utilisateur.setCreatedAt(LocalDateTime.now());

        return utilisateurRepository.save(utilisateur);
    }

    // login
    public Utilisateur login(Utilisateur user) {

        if (user.getEmail() == null || user.getMotDePasse() == null) {
            throw new RuntimeException("Email et mot de passe requis");
        }

        Utilisateur u = utilisateurRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 🔥 DEBUG (tu peux enlever après)
        System.out.println("INPUT PASSWORD: " + user.getMotDePasse());
        System.out.println("HASHED DB: " + u.getMotDePasse());

        // CHECK PASSWORD
        if (!passwordEncoder.matches(user.getMotDePasse(), u.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return u;
    }

    // profil
    public Utilisateur getById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    // debug
    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }
}*/