package com.greencycle.greencycle.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "collectes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Collecte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_dechet")
    private String typeDechet;

    private Double quantite;

    private String localisation;

    @Column(name = "date_signalement")
    private LocalDateTime dateSignalement;

    private String statut;

    @ManyToOne
    @JoinColumn(name = "citoyen_id")
    @JsonIgnoreProperties({"collectesCitoyen", "collectesCollecteur"})
    private Utilisateur citoyen;

    @ManyToOne
    @JoinColumn(name = "collecteur_id")
    @JsonIgnoreProperties({"collectesCitoyen", "collectesCollecteur"})
    private Utilisateur collecteur;
}/*package com.greencycle.greencycle.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "collectes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Collecte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_dechet")
    private String typeDechet;

    private Double quantite;

    private String localisation;

    @Column(name = "date_signalement")
    private LocalDateTime dateSignalement;

    private String statut;

    // relation avec citoyen
    @ManyToOne
    @JoinColumn(name = "citoyen_id")
    @JsonBackReference
    private Utilisateur citoyen;

    // relation avec collecteur
    @ManyToOne
    @JoinColumn(name = "collecteur_id")
    @JsonBackReference(value = "collecteur")
    private Utilisateur collecteur;
}*/