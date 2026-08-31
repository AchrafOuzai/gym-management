package com.example.gymapi.dto.response;

import com.example.gymapi.enums.StatutMembre;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class MembreResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private LocalDate dateNaissance;
    private LocalDate dateInscription;
    private StatutMembre statut;
}