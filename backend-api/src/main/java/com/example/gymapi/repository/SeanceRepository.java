package com.example.gymapi.repository;

import com.example.gymapi.entity.Seance;
import com.example.gymapi.enums.TypeSeance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Long> {
    List<Seance> findByType(TypeSeance type);
    List<Seance> findByCoachId(Long coachId);
    List<Seance> findByDateHeureBetween(LocalDateTime debut, LocalDateTime fin);

    @Query("SELECT s FROM Seance s WHERE SIZE(s.membres) < s.capaciteMax AND s.dateHeure > :now")
    List<Seance> findSeancesDisponibles(LocalDateTime now);
}