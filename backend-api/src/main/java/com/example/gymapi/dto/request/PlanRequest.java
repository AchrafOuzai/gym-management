package com.example.gymapi.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PlanRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "La durée est obligatoire")
    @Min(value = 1, message = "La durée doit être au moins 1 mois")
    private Integer dureeMois;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")
    private BigDecimal prix;

    private Integer nombreSeancesIncluses;

    private Boolean accesPiscine;

    private Boolean accesCoach;
}