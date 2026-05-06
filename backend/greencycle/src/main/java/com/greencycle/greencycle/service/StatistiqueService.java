package com.greencycle.greencycle.service;

import com.greencycle.greencycle.repository.CollecteRepository;
import com.greencycle.greencycle.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatistiqueService {

    private final CollecteRepository collecteRepository;
    private final UtilisateurRepository utilisateurRepository;

    public StatistiqueService(CollecteRepository collecteRepository,
                              UtilisateurRepository utilisateurRepository) {
        this.collecteRepository = collecteRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public Map<String, Object> getStats() {

        Map<String, Object> stats = new HashMap<>();

        long totalCollectes = collecteRepository.count();
        long totalUsers = utilisateurRepository.count();

        double totalKg = collecteRepository.findAll()
                .stream()
                .mapToDouble(c -> c.getQuantite())
                .sum();

        stats.put("totalCollectes", totalCollectes);
        stats.put("totalUsers", totalUsers);
        stats.put("totalKgRecycles", totalKg);

        return stats;
    }
}