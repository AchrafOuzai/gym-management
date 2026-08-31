package com.example.gymapi.repository;

import com.example.gymapi.entity.Presence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {

    List<Presence> findByMembreId(Long membreId);
    List<Presence> findBySeanceId(Long seanceId);

    @Query("SELECT COUNT(p) FROM Presence p WHERE p.seance.id = :seanceId AND p.present = true")
    long countPresentsParSeance(Long seanceId);

    @Query("SELECT COUNT(p) FROM Presence p WHERE p.membre.id = :membreId AND p.present = true")
    long countSeancesAssistees(Long membreId);
}