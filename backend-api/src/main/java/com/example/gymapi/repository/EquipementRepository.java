package com.example.gymapi.repository;

import com.example.gymapi.entity.Equipement;
import com.example.gymapi.enums.EtatEquipement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    List<Equipement> findByEtat(EtatEquipement etat);
    List<Equipement> findBySalle(String salle);
    List<Equipement> findByNomContainingIgnoreCase(String nom);
}