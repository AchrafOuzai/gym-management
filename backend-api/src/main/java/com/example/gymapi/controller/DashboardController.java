package com.example.gymapi.controller;

import com.example.gymapi.dto.response.ChartDataResponse;
import com.example.gymapi.dto.response.DashboardStatsResponse;
import com.example.gymapi.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/charts/revenus")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChartDataResponse> getRevenusParMois(
            @RequestParam(defaultValue = "0") int year) {
        int y = year == 0 ? LocalDate.now().getYear() : year;
        return ResponseEntity.ok(dashboardService.getRevenusParMois(y));
    }

    @GetMapping("/charts/membres")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChartDataResponse> getNouveauxMembres(
            @RequestParam(defaultValue = "0") int year) {
        int y = year == 0 ? LocalDate.now().getYear() : year;
        return ResponseEntity.ok(dashboardService.getNouveauxMembresParMois(y));
    }

    @GetMapping("/charts/statuts")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<ChartDataResponse> getStatutsMembres() {
        return ResponseEntity.ok(dashboardService.getStatutsMembers());
    }
}