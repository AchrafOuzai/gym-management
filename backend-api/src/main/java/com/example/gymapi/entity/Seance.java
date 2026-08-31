package com.example.gymapi.entity;

import com.example.gymapi.enums.TypeSeance;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "seances")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeSeance type;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    @Column(nullable = false)
    private Integer dureeMinutes;

    @Column(nullable = false)
    private Integer capaciteMax;

    private String salle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @ManyToMany(mappedBy = "seances", fetch = FetchType.LAZY)
    private List<Membre> membres;
}