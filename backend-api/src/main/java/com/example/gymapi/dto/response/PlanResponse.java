package com.example.gymapi.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PlanResponse {
    private Long id;
    private String nom;
    private String description;
    private Integer dureeMois;
    private BigDecimal prix;
    private Integer nombreSeancesIncluses;
    private Boolean accesPiscine;
    private Boolean accesCoach;
    private Boolean actif;
}