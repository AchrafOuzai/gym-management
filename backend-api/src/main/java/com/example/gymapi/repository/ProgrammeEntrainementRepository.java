package com.example.gymapi.repository;

import com.example.gymapi.entity.ProgrammeEntrainement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammeEntrainementRepository extends JpaRepository<ProgrammeEntrainement, Long> {

    List<ProgrammeEntrainement> findByMembreId(Long membreId);
    List<ProgrammeEntrainement> findByCoachId(Long coachId);
    List<ProgrammeEntrainement> findByMembreIdAndActifTrue(Long membreId);
}