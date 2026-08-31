package com.example.gymapi.entity;

import com.example.gymapi.enums.TypeSeance;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "coachs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coach {

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

    @Column(length = 500)
    private String bio;

    @Column(nullable = false)
    private LocalDate dateEmbauche;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "coach_specialites", joinColumns = @JoinColumn(name = "coach_id"))
    @Column(name = "specialite")
    private List<TypeSeance> specialites;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    @OneToMany(mappedBy = "coach", fetch = FetchType.LAZY)
    private List<Seance> seances;
}