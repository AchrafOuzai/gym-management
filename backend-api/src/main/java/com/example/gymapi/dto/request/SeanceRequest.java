package com.example.gymapi.dto.request;

import com.example.gymapi.enums.TypeSeance;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SeanceRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "Le type est obligatoire")
    private TypeSeance type;

    @NotNull(message = "La date/heure est obligatoire")
    private LocalDateTime dateHeure;

    @NotNull
    @Min(value = 15, message = "La durée minimale est 15 minutes")
    private Integer dureeMinutes;

    @NotNull
    @Min(value = 1, message = "La capacité doit être au moins 1")
    private Integer capaciteMax;

    private String salle;

    private Long coachId;
}