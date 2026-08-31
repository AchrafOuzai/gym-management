package com.example.gymapi.dto.response;

import com.example.gymapi.enums.StatutReservation;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private Long membreId;
    private String membreNomComplet;
    private Long seanceId;
    private String seanceTitre;
    private LocalDateTime dateReservation;
    private LocalDateTime seanceDateHeure;
    private StatutReservation statut;
    private LocalDateTime dateAnnulation;
    private String motifAnnulation;
}