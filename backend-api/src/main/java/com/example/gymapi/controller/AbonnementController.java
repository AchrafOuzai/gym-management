package com.example.gymapi.controller;

import com.example.gymapi.dto.request.AbonnementRequest;
import com.example.gymapi.dto.response.AbonnementResponse;
import com.example.gymapi.service.AbonnementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/abonnements")
@RequiredArgsConstructor
public class AbonnementController {

    private final AbonnementService abonnementService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AbonnementResponse>> findAll() {
        return ResponseEntity.ok(abonnementService.findAll());
    }

    @GetMapping("/membre/{membreId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<AbonnementResponse>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(abonnementService.findByMembre(membreId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<AbonnementResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(abonnementService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AbonnementResponse> create(@Valid @RequestBody AbonnementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(abonnementService.create(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        abonnementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}