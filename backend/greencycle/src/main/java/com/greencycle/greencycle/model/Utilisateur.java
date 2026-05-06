package com.greencycle.greencycle.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    private String role;

    @Column(name = "points_ecologiques")
    private Integer pointsEcologiques;

    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "citoyen")
    @JsonIgnoreProperties("citoyen")
    private List<Collecte> collectesCitoyen;


    @OneToMany(mappedBy = "collecteur")
    @JsonIgnoreProperties("collecteur")
    private List<Collecte> collectesCollecteur;
}




/*package com.greencycle.greencycle.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    private String role;

    @Column(name = "points_ecologiques")
    private Integer pointsEcologiques;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // relation citoyen
    @OneToMany(mappedBy = "citoyen")
    @JsonManagedReference
    private List<Collecte> collectesCitoyen;

    // relation collecteur
    @OneToMany(mappedBy = "collecteur")
    @JsonManagedReference(value = "collecteur")
    private List<Collecte> collectesCollecteur;
}

 */