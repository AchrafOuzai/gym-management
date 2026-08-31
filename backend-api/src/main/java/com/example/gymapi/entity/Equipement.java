package com.example.gymapi.entity;

import com.example.gymapi.enums.EtatEquipement;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "equipements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Equipement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 500)
    private String description;

    private String marque;

    private String modele;

    @Column(nullable = false)
    private Integer quantite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EtatEquipement etat = EtatEquipement.BON_ETAT;

    private LocalDate dateAchat;

    private LocalDate dateDerniereRevision;

    private String salle;
}