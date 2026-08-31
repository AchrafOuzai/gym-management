package com.example.gymapi.dto.response;

import com.example.gymapi.enums.TypeSeance;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class CoachResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String bio;
    private LocalDate dateEmbauche;
    private List<TypeSeance> specialites;
    private Boolean actif;
}