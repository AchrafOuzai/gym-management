package com.example.gymapi.dto.response;

import com.example.gymapi.enums.TypeSeance;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SeanceResponse {
    private Long id;
    private String titre;
    private String description;
    private TypeSeance type;
    private LocalDateTime dateHeure;
    private Integer dureeMinutes;
    private Integer capaciteMax;
    private Integer placesRestantes;
    private String salle;
    private Long coachId;
    private String coachNomComplet;
}