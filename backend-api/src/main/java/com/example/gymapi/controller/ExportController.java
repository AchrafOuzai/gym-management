package com.example.gymapi.controller;

import com.example.gymapi.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/membres/excel")
    public ResponseEntity<byte[]> exportMembresExcel() throws IOException {
        byte[] data = exportService.exportMembresExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=membres_" + LocalDate.now() + ".xlsx")
                .contentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @GetMapping("/membres/pdf")
    public ResponseEntity<byte[]> exportMembresPdf() throws IOException {
        byte[] data = exportService.exportMembresPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=membres_" + LocalDate.now() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    @GetMapping("/paiements/excel")
    public ResponseEntity<byte[]> exportPaiementsExcel() throws IOException {
        byte[] data = exportService.exportPaiementsExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=paiements_" + LocalDate.now() + ".xlsx")
                .contentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}