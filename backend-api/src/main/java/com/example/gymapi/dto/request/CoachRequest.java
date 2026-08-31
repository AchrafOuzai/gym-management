package com.example.gymapi.dto.request;

import com.example.gymapi.enums.TypeSeance;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CoachRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    private String telephone;

    private String bio;

    @NotNull(message = "La date d'embauche est obligatoire")
    private LocalDate dateEmbauche;

    private List<TypeSeance> specialites;
}