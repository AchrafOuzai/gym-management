package com.example.gymapi.entity;

import com.example.gymapi.enums.StatutMembre;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "membres")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Membre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    private LocalDate dateNaissance;

    @Column(nullable = false)
    private LocalDate dateInscription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutMembre statut = StatutMembre.ACTIF;

    @OneToMany(mappedBy = "membre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Abonnement> abonnements;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "membre_seance",
        joinColumns = @JoinColumn(name = "membre_id"),
        inverseJoinColumns = @JoinColumn(name = "seance_id")
    )
    private List<Seance> seances;
}