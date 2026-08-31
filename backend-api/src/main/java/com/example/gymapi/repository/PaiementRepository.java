package com.example.gymapi.repository;

import com.example.gymapi.entity.Paiement;
import com.example.gymapi.enums.StatutPaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    List<Paiement> findByMembreId(Long membreId);
    List<Paiement> findByStatut(StatutPaiement statut);
    List<Paiement> findByAbonnementId(Long abonnementId);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.statut = 'PAYE' " +
           "AND MONTH(p.datePaiement) = MONTH(:date) AND YEAR(p.datePaiement) = YEAR(:date)")
    BigDecimal sumRevenusMois(LocalDate date);

    @Query("SELECT p FROM Paiement p WHERE p.statut = 'EN_ATTENTE' AND p.dateEcheance < :today")
    List<Paiement> findPaiementsEnRetard(LocalDate today);

    @Query("SELECT COUNT(p) FROM Paiement p WHERE p.statut = 'EN_RETARD'")
    long countPaiementsEnRetard();

    @Query("SELECT MONTH(p.datePaiement), SUM(p.montant) FROM Paiement p " +
           "WHERE p.statut = 'PAYE' AND YEAR(p.datePaiement) = :year " +
           "GROUP BY MONTH(p.datePaiement) ORDER BY MONTH(p.datePaiement)")
    List<Object[]> sumRevenusParMois(int year);

    @Query("SELECT MONTH(m.dateInscription), COUNT(m) FROM Membre m " +
           "WHERE YEAR(m.dateInscription) = :year " +
           "GROUP BY MONTH(m.dateInscription) ORDER BY MONTH(m.dateInscription)")
    List<Object[]> countNouveauxMembresParMois(int year);
}