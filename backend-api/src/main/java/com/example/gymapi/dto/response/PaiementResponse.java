package com.example.gymapi.dto.response;

import com.example.gymapi.enums.StatutPaiement;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PaiementResponse {
    private Long id;
    private Long membreId;
    private String membreNomComplet;
    private Long abonnementId;
    private BigDecimal montant;
    private LocalDate datePaiement;
    private LocalDate dateEcheance;
    private StatutPaiement statut;
    private String methodePaiement;
    private String notes;
}