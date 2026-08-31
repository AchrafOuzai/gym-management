package com.example.gymapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationRequest {

    @NotNull(message = "L'ID du membre est obligatoire")
    private Long membreId;

    @NotNull(message = "L'ID de la séance est obligatoire")
    private Long seanceId;
}