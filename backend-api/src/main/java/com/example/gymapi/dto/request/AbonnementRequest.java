package com.example.gymapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AbonnementRequest {

    @NotNull(message = "L'ID du membre est obligatoire")
    private Long membreId;

    @NotNull(message = "L'ID du plan est obligatoire")
    private Long planId;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    private String notes;
}