package com.example.gymapi.controller;

import com.example.gymapi.dto.request.SeanceRequest;
import com.example.gymapi.dto.response.SeanceResponse;
import com.example.gymapi.service.SeanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seances")
@RequiredArgsConstructor
public class SeanceController {

    private final SeanceService seanceService;

    // Tout le monde peut voir les séances
    @GetMapping
    public ResponseEntity<List<SeanceResponse>> findAll() {
        return ResponseEntity.ok(seanceService.findAll());
    }

    // Tout le monde peut voir les séances disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<List<SeanceResponse>> findDisponibles() {
        return ResponseEntity.ok(seanceService.findDisponibles());
    }

    // Tout le monde peut voir une séance par ID
    @GetMapping("/{id}")
    public ResponseEntity<SeanceResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(seanceService.findById(id));
    }

    // ADMIN et COACH seulement peuvent créer
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<SeanceResponse> create(
            @Valid @RequestBody SeanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(seanceService.create(request));
    }

    // ADMIN et COACH seulement peuvent modifier
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<SeanceResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SeanceRequest request) {
        return ResponseEntity.ok(seanceService.update(id, request));
    }

    // ADMIN seulement peut supprimer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        seanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}