package com.example.gymapi.service;

import com.example.gymapi.dto.request.PaiementRequest;
import com.example.gymapi.dto.response.PaiementResponse;
import com.example.gymapi.entity.Abonnement;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Paiement;
import com.example.gymapi.enums.StatutPaiement;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.AbonnementRepository;
import com.example.gymapi.repository.MembreRepository;
import com.example.gymapi.repository.PaiementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final MembreRepository membreRepository;
    private final AbonnementRepository abonnementRepository;

    public List<PaiementResponse> findAll() {
        return paiementRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PaiementResponse> findByMembre(Long membreId) {
        return paiementRepository.findByMembreId(membreId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PaiementResponse> findEnRetard() {
        // Met à jour le statut des paiements en retard d'abord
        List<Paiement> enRetard = paiementRepository.findPaiementsEnRetard(LocalDate.now());
        enRetard.forEach(p -> p.setStatut(StatutPaiement.EN_RETARD));
        paiementRepository.saveAll(enRetard);
        return paiementRepository.findByStatut(StatutPaiement.EN_RETARD)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PaiementResponse create(PaiementRequest request) {
        Membre membre = membreRepository.findById(request.getMembreId())
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé"));
        Abonnement abonnement = abonnementRepository.findById(request.getAbonnementId())
                .orElseThrow(() -> new ResourceNotFoundException("Abonnement non trouvé"));

        Paiement paiement = Paiement.builder()
                .membre(membre)
                .abonnement(abonnement)
                .montant(request.getMontant())
                .dateEcheance(request.getDateEcheance())
                .datePaiement(request.getDatePaiement())
                .methodePaiement(request.getMethodePaiement())
                .notes(request.getNotes())
                .statut(request.getDatePaiement() != null ? StatutPaiement.PAYE : StatutPaiement.EN_ATTENTE)
                .build();

        return toResponse(paiementRepository.save(paiement));
    }

    public PaiementResponse marquerPaye(Long id, String methodePaiement) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé avec l'id: " + id));
        paiement.setStatut(StatutPaiement.PAYE);
        paiement.setDatePaiement(LocalDate.now());
        paiement.setMethodePaiement(methodePaiement);
        return toResponse(paiementRepository.save(paiement));
    }

    public void delete(Long id) {
        if (!paiementRepository.existsById(id))
            throw new ResourceNotFoundException("Paiement non trouvé avec l'id: " + id);
        paiementRepository.deleteById(id);
    }

    private PaiementResponse toResponse(Paiement p) {
        return PaiementResponse.builder()
                .id(p.getId())
                .membreId(p.getMembre().getId())
                .membreNomComplet(p.getMembre().getPrenom() + " " + p.getMembre().getNom())
                .abonnementId(p.getAbonnement().getId())
                .montant(p.getMontant())
                .datePaiement(p.getDatePaiement())
                .dateEcheance(p.getDateEcheance())
                .statut(p.getStatut())
                .methodePaiement(p.getMethodePaiement())
                .notes(p.getNotes())
                .build();
    }
}