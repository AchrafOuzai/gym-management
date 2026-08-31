package com.example.gymapi.repository;

import com.example.gymapi.entity.Membre;
import com.example.gymapi.enums.StatutMembre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembreRepository extends JpaRepository<Membre, Long> {
    Optional<Membre> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Membre> findByStatut(StatutMembre statut);
    List<Membre> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    @Query("SELECT COUNT(m) FROM Membre m WHERE m.statut = 'ACTIF'")
    long countMembresActifs();
}