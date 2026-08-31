package com.example.gymapi.controller;

import com.example.gymapi.dto.request.CoachRequest;
import com.example.gymapi.dto.response.CoachResponse;
import com.example.gymapi.service.CoachService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coachs")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<CoachResponse>> findAll() {
        return ResponseEntity.ok(coachService.findAll());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<CoachResponse>> findActifs() {
        return ResponseEntity.ok(coachService.findActifs());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<CoachResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CoachResponse> create(@Valid @RequestBody CoachRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(coachService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CoachResponse> update(@PathVariable Long id, @Valid @RequestBody CoachRequest request) {
        return ResponseEntity.ok(coachService.update(id, request));
    }

    @PatchMapping("/{id}/desactiver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        coachService.desactiver(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        coachService.delete(id);
        return ResponseEntity.noContent().build();
    }
}