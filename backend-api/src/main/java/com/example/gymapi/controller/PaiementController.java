package com.example.gymapi.controller;

import com.example.gymapi.dto.request.PaiementRequest;
import com.example.gymapi.dto.response.PaiementResponse;
import com.example.gymapi.service.PaiementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaiementResponse>> findAll() {
        return ResponseEntity.ok(paiementService.findAll());
    }

    @GetMapping("/membre/{membreId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<PaiementResponse>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(paiementService.findByMembre(membreId));
    }

    @GetMapping("/en-retard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaiementResponse>> findEnRetard() {
        return ResponseEntity.ok(paiementService.findEnRetard());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaiementResponse> create(@Valid @RequestBody PaiementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paiementService.create(request));
    }

    @PatchMapping("/{id}/payer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaiementResponse> marquerPaye(@PathVariable Long id,
                                                         @RequestParam(required = false) String methode) {
        return ResponseEntity.ok(paiementService.marquerPaye(id, methode));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paiementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}