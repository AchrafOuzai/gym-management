package com.example.gymapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PresenceRequest {

    @NotNull
    private Long membreId;

    @NotNull
    private Long seanceId;

    @NotNull
    private LocalDateTime dateHeureArrivee;

    private LocalDateTime dateHeureDepart;

    private Boolean present = true;
}