package com.example.gymapi.dto.response;

import com.example.gymapi.enums.EtatEquipement;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class EquipementResponse {
    private Long id;
    private String nom;
    private String description;
    private String marque;
    private String modele;
    private Integer quantite;
    private EtatEquipement etat;
    private LocalDate dateAchat;
    private LocalDate dateDerniereRevision;
    private String salle;
}