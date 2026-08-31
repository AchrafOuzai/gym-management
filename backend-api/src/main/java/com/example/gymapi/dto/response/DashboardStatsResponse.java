package com.example.gymapi.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsResponse {
    // Membres
    private long totalMembres;
    private long membresActifs;
    private long membersSuspendus;
    private long nouveauxMembresMois;

    // Finances
    private BigDecimal revenusMois;
    private BigDecimal revenusTotal;
    private long paiementsEnRetard;
    private long abonnementsExpirantBientot;

    // Activité
    private long totalSeances;
    private long seancesDisponibles;
    private long totalCoachs;
    private long coachsActifs;
    private long totalEquipements;
    private long equipementsEnMaintenance;

    // Reservations
    private long totalReservations;
    private long reservationsAujourdhui;
}