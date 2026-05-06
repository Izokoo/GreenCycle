package com.greencycle.greencycle.controller;

import com.greencycle.greencycle.model.Utilisateur;
import com.greencycle.greencycle.service.UtilisateurService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // Register
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Utilisateur register(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.register(utilisateur);
    }

    // Login
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Utilisateur login(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.login(utilisateur);
    }

    // leaderboard
    @GetMapping("/leaderboard")
    public List<Utilisateur> leaderboard() {
        return utilisateurService.getLeaderboard();
    }

    // debug
    @GetMapping
    public List<Utilisateur> getAll() {
        return utilisateurService.getAll();
    }
}