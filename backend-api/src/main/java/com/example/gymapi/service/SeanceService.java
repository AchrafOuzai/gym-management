package com.example.gymapi.service;

import com.example.gymapi.dto.request.SeanceRequest;
import com.example.gymapi.dto.response.SeanceResponse;
import com.example.gymapi.entity.Coach;
import com.example.gymapi.entity.Seance;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.CoachRepository;
import com.example.gymapi.repository.PresenceRepository;
import com.example.gymapi.repository.ReservationRepository;
import com.example.gymapi.repository.SeanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SeanceService {

    private final SeanceRepository seanceRepository;
    private final CoachRepository coachRepository;
    private final ReservationRepository reservationRepository;
    private final PresenceRepository presenceRepository;

    public List<SeanceResponse> findAll() {
        return seanceRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SeanceResponse> findDisponibles() {
        return seanceRepository.findSeancesDisponibles(LocalDateTime.now())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SeanceResponse findById(Long id) {
        return toResponse(seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Séance non trouvée avec l'id: " + id)));
    }

    public SeanceResponse create(SeanceRequest request) {
        Coach coach = null;
        if (request.getCoachId() != null) {
            coach = coachRepository.findById(request.getCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Coach non trouvé avec l'id: " + request.getCoachId()));
        }
        Seance seance = Seance.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .type(request.getType())
                .dateHeure(request.getDateHeure())
                .dureeMinutes(request.getDureeMinutes())
                .capaciteMax(request.getCapaciteMax())
                .salle(request.getSalle())
                .coach(coach)
                .build();
        return toResponse(seanceRepository.save(seance));
    }

    public SeanceResponse update(Long id, SeanceRequest request) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Séance non trouvée avec l'id: " + id));
        Coach coach = null;
        if (request.getCoachId() != null) {
            coach = coachRepository.findById(request.getCoachId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Coach non trouvé avec l'id: " + request.getCoachId()));
        }
        seance.setTitre(request.getTitre());
        seance.setDescription(request.getDescription());
        seance.setType(request.getType());
        seance.setDateHeure(request.getDateHeure());
        seance.setDureeMinutes(request.getDureeMinutes());
        seance.setCapaciteMax(request.getCapaciteMax());
        seance.setSalle(request.getSalle());
        seance.setCoach(coach);
        return toResponse(seanceRepository.save(seance));
    }

    public void delete(Long id) {
        Seance seance = seanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Séance non trouvée avec l'id: " + id));

        // 1. Supprimer les présences liées
        presenceRepository.deleteAll(
            presenceRepository.findBySeanceId(id));

        // 2. Supprimer les réservations liées
        reservationRepository.deleteAll(
            reservationRepository.findBySeanceId(id));

        // 3. Supprimer la séance
        seanceRepository.delete(seance);
    }

    private SeanceResponse toResponse(Seance s) {
        int inscrits = s.getMembres() == null ? 0 : s.getMembres().size();
        return SeanceResponse.builder()
                .id(s.getId())
                .titre(s.getTitre())
                .description(s.getDescription())
                .type(s.getType())
                .dateHeure(s.getDateHeure())
                .dureeMinutes(s.getDureeMinutes())
                .capaciteMax(s.getCapaciteMax())
                .placesRestantes(s.getCapaciteMax() - inscrits)
                .salle(s.getSalle())
                .coachId(s.getCoach() != null ? s.getCoach().getId() : null)
                .coachNomComplet(s.getCoach() != null
                    ? s.getCoach().getPrenom() + " " + s.getCoach().getNom() : null)
                .build();
    }
}