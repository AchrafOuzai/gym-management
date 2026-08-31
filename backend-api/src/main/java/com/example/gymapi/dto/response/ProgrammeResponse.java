package com.example.gymapi.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class ProgrammeResponse {
    private Long id;
    private Long membreId;
    private String membreNomComplet;
    private Long coachId;
    private String coachNomComplet;
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String contenu;
    private Boolean actif;
}