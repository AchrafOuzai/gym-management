package com.example.gymapi.controller;

import com.example.gymapi.dto.request.PresenceRequest;
import com.example.gymapi.dto.response.PresenceResponse;
import com.example.gymapi.service.PresenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presences")
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    @GetMapping("/seance/{seanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<PresenceResponse>> findBySeance(@PathVariable Long seanceId) {
        return ResponseEntity.ok(presenceService.findBySeance(seanceId));
    }

    @GetMapping("/membre/{membreId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<PresenceResponse>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(presenceService.findByMembre(membreId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<PresenceResponse> enregistrer(@Valid @RequestBody PresenceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(presenceService.enregistrer(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        presenceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}