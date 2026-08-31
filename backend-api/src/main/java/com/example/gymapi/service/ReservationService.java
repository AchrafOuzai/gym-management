package com.example.gymapi.service;

import com.example.gymapi.dto.request.ReservationRequest;
import com.example.gymapi.dto.response.ReservationResponse;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Reservation;
import com.example.gymapi.entity.Seance;
import com.example.gymapi.enums.StatutReservation;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.MembreRepository;
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
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final MembreRepository membreRepository;
    private final SeanceRepository seanceRepository;

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReservationResponse> findByMembre(Long membreId) {
        return reservationRepository.findByMembreId(membreId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReservationResponse> findBySeance(Long seanceId) {
        return reservationRepository.findBySeanceId(seanceId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ReservationResponse reserver(ReservationRequest request) {
        Membre membre = membreRepository.findById(request.getMembreId())
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé"));
        Seance seance = seanceRepository.findById(request.getSeanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Séance non trouvée"));

        // Vérifie si déjà réservé
        reservationRepository.findByMembreIdAndSeanceId(request.getMembreId(), request.getSeanceId())
                .ifPresent(r -> { throw new RuntimeException("Vous avez déjà réservé cette séance"); });

        // Vérifie capacité
        long placesOccupees = reservationRepository.countConfirmeesParSeance(seance.getId());
        StatutReservation statut = placesOccupees >= seance.getCapaciteMax()
                ? StatutReservation.LISTE_ATTENTE
                : StatutReservation.CONFIRMEE;

        Reservation reservation = Reservation.builder()
                .membre(membre)
                .seance(seance)
                .dateReservation(LocalDateTime.now())
                .statut(statut)
                .build();

        return toResponse(reservationRepository.save(reservation));
    }

    public ReservationResponse annuler(Long id, String motif) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée avec l'id: " + id));
        reservation.setStatut(StatutReservation.ANNULEE);
        reservation.setDateAnnulation(LocalDateTime.now());
        reservation.setMotifAnnulation(motif);
        return toResponse(reservationRepository.save(reservation));
    }

    private ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .membreId(r.getMembre().getId())
                .membreNomComplet(r.getMembre().getPrenom() + " " + r.getMembre().getNom())
                .seanceId(r.getSeance().getId())
                .seanceTitre(r.getSeance().getTitre())
                .seanceDateHeure(r.getSeance().getDateHeure())
                .dateReservation(r.getDateReservation())
                .statut(r.getStatut())
                .dateAnnulation(r.getDateAnnulation())
                .motifAnnulation(r.getMotifAnnulation())
                .build();
    }
}