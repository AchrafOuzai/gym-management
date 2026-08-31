package com.example.gymapi.service;

import com.example.gymapi.dto.request.PresenceRequest;
import com.example.gymapi.dto.response.PresenceResponse;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Presence;
import com.example.gymapi.entity.Seance;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.MembreRepository;
import com.example.gymapi.repository.PresenceRepository;
import com.example.gymapi.repository.SeanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PresenceService {

    private final PresenceRepository presenceRepository;
    private final MembreRepository membreRepository;
    private final SeanceRepository seanceRepository;

    public List<PresenceResponse> findBySeance(Long seanceId) {
        return presenceRepository.findBySeanceId(seanceId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PresenceResponse> findByMembre(Long membreId) {
        return presenceRepository.findByMembreId(membreId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PresenceResponse enregistrer(PresenceRequest request) {
        Membre membre = membreRepository.findById(request.getMembreId())
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé"));
        Seance seance = seanceRepository.findById(request.getSeanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Séance non trouvée"));

        Presence presence = Presence.builder()
                .membre(membre)
                .seance(seance)
                .dateHeureArrivee(request.getDateHeureArrivee())
                .dateHeureDepart(request.getDateHeureDepart())
                .present(request.getPresent())
                .build();

        return toResponse(presenceRepository.save(presence));
    }

    public void delete(Long id) {
        if (!presenceRepository.existsById(id))
            throw new ResourceNotFoundException("Présence non trouvée avec l'id: " + id);
        presenceRepository.deleteById(id);
    }

    private PresenceResponse toResponse(Presence p) {
        return PresenceResponse.builder()
                .id(p.getId())
                .membreId(p.getMembre().getId())
                .membreNomComplet(p.getMembre().getPrenom() + " " + p.getMembre().getNom())
                .seanceId(p.getSeance().getId())
                .seanceTitre(p.getSeance().getTitre())
                .dateHeureArrivee(p.getDateHeureArrivee())
                .dateHeureDepart(p.getDateHeureDepart())
                .present(p.getPresent())
                .build();
    }
}