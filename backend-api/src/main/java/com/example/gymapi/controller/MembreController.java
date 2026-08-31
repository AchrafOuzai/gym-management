package com.example.gymapi.controller;

import com.example.gymapi.dto.request.MembreRequest;
import com.example.gymapi.dto.response.MembreResponse;
import com.example.gymapi.service.MembreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membres")
@RequiredArgsConstructor
public class MembreController {

    private final MembreService membreService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<MembreResponse>> findAll() {
        return ResponseEntity.ok(membreService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<MembreResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(membreService.findById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<MembreResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(membreService.search(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembreResponse> create(@Valid @RequestBody MembreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(membreService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembreResponse> update(@PathVariable Long id, @Valid @RequestBody MembreRequest request) {
        return ResponseEntity.ok(membreService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        membreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}