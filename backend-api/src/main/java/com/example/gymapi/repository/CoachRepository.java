package com.example.gymapi.repository;

import com.example.gymapi.entity.Coach;
import com.example.gymapi.enums.TypeSeance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long> {
    Optional<Coach> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Coach> findByActifTrue();

    @Query("SELECT c FROM Coach c JOIN c.specialites s WHERE s = :specialite AND c.actif = true")
    List<Coach> findBySpecialite(TypeSeance specialite);
}