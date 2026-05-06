package com.greencycle.greencycle.service;

import com.greencycle.greencycle.model.Collecte;
import com.greencycle.greencycle.model.Utilisateur;
import com.greencycle.greencycle.repository.CollecteRepository;
import com.greencycle.greencycle.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CollecteService {

    private final CollecteRepository collecteRepository;
    private final UtilisateurRepository utilisateurRepository;

    public CollecteService(CollecteRepository collecteRepository,
                           UtilisateurRepository utilisateurRepository) {
        this.collecteRepository = collecteRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // toutes les collectes
    public List<Collecte> getAllCollectes() {
        return collecteRepository.findAll();
    }

    // récupérer une collecte (important pour controller)
    public Collecte getById(Long id) {
        return collecteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collecte non trouvée"));
    }

    // créer une collecte (USER)
    public Collecte creerCollecte(Collecte collecte, Long citoyenId) {

        if (collecte.getQuantite() == null || collecte.getQuantite() <= 0) {
            throw new RuntimeException("Quantité doit être > 0");
        }

        Utilisateur citoyen = utilisateurRepository.findById(citoyenId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        collecte.setCitoyen(citoyen);
        collecte.setStatut("EN_ATTENTE");
        collecte.setDateSignalement(LocalDateTime.now());

        return collecteRepository.save(collecte);
    }

    // collectes en attente (COLLECTOR)
    public List<Collecte> getCollectesEnAttente() {
        return collecteRepository.findByStatut("EN_ATTENTE");
    }

    // prendre une collecte (COLLECTOR)
    public Collecte prendreCollecte(Long collecteId, Long collecteurId) {

        Collecte collecte = collecteRepository.findById(collecteId)
                .orElseThrow(() -> new RuntimeException("Collecte non trouvée"));

        if (!"EN_ATTENTE".equals(collecte.getStatut())) {
            throw new RuntimeException("Collecte non disponible");
        }

        Utilisateur collecteur = utilisateurRepository.findById(collecteurId)
                .orElseThrow(() -> new RuntimeException("Collecteur non trouvé"));

        collecte.setCollecteur(collecteur);
        collecte.setStatut("EN_COURS");

        return collecteRepository.save(collecte);
    }

    // terminer une collecte + points (COLLECTOR)
    public Collecte terminerCollecte(Long collecteId) {

        Collecte collecte = collecteRepository.findById(collecteId)
                .orElseThrow(() -> new RuntimeException("Collecte non trouvée"));

        if (!"EN_COURS".equals(collecte.getStatut())) {
            throw new RuntimeException("Collecte non valide");
        }

        collecte.setStatut("TERMINE");

        Utilisateur citoyen = collecte.getCitoyen();
        int points = (int) (collecte.getQuantite() * 10);

        if (citoyen.getPointsEcologiques() == null) {
            citoyen.setPointsEcologiques(0);
        }

        citoyen.setPointsEcologiques(citoyen.getPointsEcologiques() + points);

        utilisateurRepository.save(citoyen);

        return collecteRepository.save(collecte);
    }
}