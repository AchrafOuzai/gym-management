package com.example.gymapi.controller;

import com.example.gymapi.dto.response.NotificationResponse;
import com.example.gymapi.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/membre/{membreId}")
    public ResponseEntity<List<NotificationResponse>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(notificationService.findByMembre(membreId));
    }

    @GetMapping("/membre/{membreId}/non-lues")
    public ResponseEntity<List<NotificationResponse>> findNonLues(@PathVariable Long membreId) {
        return ResponseEntity.ok(notificationService.findNonLues(membreId));
    }

    @GetMapping("/membre/{membreId}/count")
    public ResponseEntity<Long> countNonLues(@PathVariable Long membreId) {
        return ResponseEntity.ok(notificationService.countNonLues(membreId));
    }

    @PatchMapping("/{id}/lue")
    public ResponseEntity<Void> marquerLue(@PathVariable Long id) {
        notificationService.marquerLue(id);
        return ResponseEntity.noContent().build();
    }
}