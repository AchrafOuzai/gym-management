package com.example.gymapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer dureeMois;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    private Integer nombreSeancesIncluses;

    private Boolean accesPiscine;

    private Boolean accesCoach;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    @OneToMany(mappedBy = "plan", fetch = FetchType.LAZY)
    private List<Abonnement> abonnements;
}