package com.example.gymapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProgrammeRequest {

    @NotNull
    private Long membreId;

    @NotNull
    private Long coachId;

    @NotBlank
    private String titre;

    private String description;

    @NotNull
    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String contenu;
}