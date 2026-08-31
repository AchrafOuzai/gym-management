package com.example.gymapi.repository;

import com.example.gymapi.entity.Reservation;
import com.example.gymapi.enums.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByMembreId(Long membreId);
    List<Reservation> findBySeanceId(Long seanceId);
    Optional<Reservation> findByMembreIdAndSeanceId(Long membreId, Long seanceId);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.seance.id = :seanceId AND r.statut = 'CONFIRMEE'")
    long countConfirmeesParSeance(Long seanceId);

    List<Reservation> findByMembreIdAndStatut(Long membreId, StatutReservation statut);
}