package com.example.gymapi.dto.response;

import com.example.gymapi.enums.TypeNotification;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private Long membreId;
    private TypeNotification type;
    private String titre;
    private String message;
    private LocalDateTime dateCreation;
    private Boolean lue;
}