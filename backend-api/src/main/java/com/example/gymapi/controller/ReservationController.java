package com.example.gymapi.controller;

import com.example.gymapi.dto.request.ReservationRequest;
import com.example.gymapi.dto.response.ReservationResponse;
import com.example.gymapi.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<ReservationResponse>> findAll() {
        return ResponseEntity.ok(reservationService.findAll());
    }

    @GetMapping("/membre/{membreId}")
    public ResponseEntity<List<ReservationResponse>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(reservationService.findByMembre(membreId));
    }

    @GetMapping("/seance/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<ReservationResponse>> findBySeance(@PathVariable Long seanceId) {
        return ResponseEntity.ok(reservationService.findBySeance(seanceId));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> reserver(@Valid @RequestBody ReservationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.reserver(request));
    }

    @PatchMapping("/{id}/annuler")
    public ResponseEntity<ReservationResponse> annuler(@PathVariable Long id,
                                                        @RequestParam(required = false) String motif) {
        return ResponseEntity.ok(reservationService.annuler(id, motif));
    }
}