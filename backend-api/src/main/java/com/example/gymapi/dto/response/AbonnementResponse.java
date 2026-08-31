package com.example.gymapi.dto.response;

import com.example.gymapi.enums.StatutAbonnement;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class AbonnementResponse {
    private Long id;
    private Long membreId;
    private String membreNomComplet;
    private Long planId;
    private String planNom;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private StatutAbonnement statut;
    private String notes;
}