package com.example.gymapi.controller;

import com.example.gymapi.dto.request.EquipementRequest;
import com.example.gymapi.dto.response.EquipementResponse;
import com.example.gymapi.service.EquipementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipements")
@RequiredArgsConstructor
public class EquipementController {

    private final EquipementService equipementService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<EquipementResponse>> findAll() {
        return ResponseEntity.ok(equipementService.findAll());
    }

    @GetMapping("/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<EquipementResponse>> findEnMaintenance() {
        return ResponseEntity.ok(equipementService.findEnMaintenance());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<EquipementResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(equipementService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EquipementResponse> create(@Valid @RequestBody EquipementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipementService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EquipementResponse> update(@PathVariable Long id, @Valid @RequestBody EquipementRequest request) {
        return ResponseEntity.ok(equipementService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        equipementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}