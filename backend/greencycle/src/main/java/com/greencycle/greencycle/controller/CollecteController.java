package com.greencycle.greencycle.controller;

import com.greencycle.greencycle.model.Collecte;
import com.greencycle.greencycle.service.CollecteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") //  FIX CORS (TRÈS IMPORTANT)
@RequestMapping("/collectes")
public class CollecteController {

    private final CollecteService collecteService;

    public CollecteController(CollecteService collecteService) {
        this.collecteService = collecteService;
    }

    // créer collecte
    @PostMapping
    public Collecte creerCollecte(@RequestBody Collecte collecte,
                                  @RequestParam Long citoyenId) {
        return collecteService.creerCollecte(collecte, citoyenId);
    }

    // toutes les collectes (frontend)
    @GetMapping
    public List<Collecte> getAllCollectes() {
        return collecteService.getAllCollectes();
    }

    // collectes en attente
    @GetMapping("/en-attente")
    public List<Collecte> getEnAttente() {
        return collecteService.getCollectesEnAttente();
    }

    // prendre une collecte
    @PutMapping("/{id}/prendre")
    public Collecte prendre(@PathVariable Long id,
                            @RequestParam Long collecteurId) {
        return collecteService.prendreCollecte(id, collecteurId);
    }

    // terminer une collecte
    @PutMapping("/{id}/terminer")
    public Collecte terminer(@PathVariable Long id) {
        return collecteService.terminerCollecte(id);
    }

    //  BONUS DEBUG (facultatif mais utile)
    @GetMapping("/{id}")
    public Collecte getOne(@PathVariable Long id) {
        return collecteService.getById(id);
    }
}