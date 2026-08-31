package com.example.gymapi.repository;

import com.example.gymapi.entity.Abonnement;
import com.example.gymapi.enums.StatutAbonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AbonnementRepository extends JpaRepository<Abonnement, Long> {
    List<Abonnement> findByMembreId(Long membreId);
    List<Abonnement> findByStatut(StatutAbonnement statut);

    @Query("SELECT a FROM Abonnement a WHERE a.dateFin < :today AND a.statut = 'ACTIF'")
    List<Abonnement> findAbonnementsExpires(LocalDate today);

    @Query("SELECT a FROM Abonnement a WHERE a.dateFin BETWEEN :today AND :within7days AND a.statut = 'ACTIF'")
    List<Abonnement> findAbonnementsExpirantBientot(LocalDate today, LocalDate within7days);
}