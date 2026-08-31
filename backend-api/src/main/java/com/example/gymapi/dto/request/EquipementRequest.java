package com.example.gymapi.dto.request;

import com.example.gymapi.enums.EtatEquipement;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EquipementRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String description;

    private String marque;

    private String modele;

    @NotNull
    @Min(value = 1, message = "La quantité doit être au moins 1")
    private Integer quantite;

    private EtatEquipement etat;

    private LocalDate dateAchat;

    private LocalDate dateDerniereRevision;

    private String salle;
}