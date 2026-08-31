package com.example.gymapi.service;

import com.example.gymapi.dto.response.NotificationResponse;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Notification;
import com.example.gymapi.enums.TypeNotification;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationResponse> findByMembre(Long membreId) {
        return notificationRepository.findByMembreIdOrderByDateCreationDesc(membreId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<NotificationResponse> findNonLues(Long membreId) {
        return notificationRepository.findByMembreIdAndLueFalse(membreId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public long countNonLues(Long membreId) {
        return notificationRepository.countByMembreIdAndLueFalse(membreId);
    }

    public void marquerLue(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification non trouvée"));
        n.setLue(true);
        notificationRepository.save(n);
    }

    public void creerNotification(Membre membre, TypeNotification type, String titre, String message) {
        Notification n = Notification.builder()
                .membre(membre)
                .type(type)
                .titre(titre)
                .message(message)
                .dateCreation(LocalDateTime.now())
                .build();
        notificationRepository.save(n);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .membreId(n.getMembre().getId())
                .type(n.getType())
                .titre(n.getTitre())
                .message(n.getMessage())
                .dateCreation(n.getDateCreation())
                .lue(n.getLue())
                .build();
    }
}