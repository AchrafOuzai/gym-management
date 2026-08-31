package com.example.gymapi.controller;

import com.example.gymapi.dto.request.ProgrammeRequest;
import com.example.gymapi.dto.response.ProgrammeResponse;
import com.example.gymapi.service.ProgrammeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programmes")
@RequiredArgsConstructor
public class ProgrammeController {

    private final ProgrammeService programmeService;

    @GetMapping("/membre/{membreId}")
    public ResponseEntity<List<ProgrammeResponse>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(programmeService.findByMembre(membreId));
    }

    @GetMapping("/coach/{coachId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<ProgrammeResponse>> findByCoach(@PathVariable Long coachId) {
        return ResponseEntity.ok(programmeService.findByCoach(coachId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgrammeResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(programmeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<ProgrammeResponse> create(@Valid @RequestBody ProgrammeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(programmeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<ProgrammeResponse> update(@PathVariable Long id, @Valid @RequestBody ProgrammeRequest request) {
        return ResponseEntity.ok(programmeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        programmeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}