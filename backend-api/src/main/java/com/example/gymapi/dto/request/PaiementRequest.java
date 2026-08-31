package com.example.gymapi.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaiementRequest {

    @NotNull
    private Long membreId;

    @NotNull
    private Long abonnementId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal montant;

    @NotNull
    private LocalDate dateEcheance;

    private LocalDate datePaiement;

    private String methodePaiement;

    private String notes;
}