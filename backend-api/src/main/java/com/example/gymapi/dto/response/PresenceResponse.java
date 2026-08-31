package com.example.gymapi.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PresenceResponse {
    private Long id;
    private Long membreId;
    private String membreNomComplet;
    private Long seanceId;
    private String seanceTitre;
    private LocalDateTime dateHeureArrivee;
    private LocalDateTime dateHeureDepart;
    private Boolean present;
}