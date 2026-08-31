package com.example.gymapi.service;

import com.example.gymapi.dto.request.AbonnementRequest;
import com.example.gymapi.dto.response.AbonnementResponse;
import com.example.gymapi.entity.Abonnement;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Plan;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.AbonnementRepository;
import com.example.gymapi.repository.MembreRepository;
import com.example.gymapi.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AbonnementService {

    private final AbonnementRepository abonnementRepository;
    private final MembreRepository membreRepository;
    private final PlanRepository planRepository;

    public List<AbonnementResponse> findAll() {
        return abonnementRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AbonnementResponse> findByMembre(Long membreId) {
        return abonnementRepository.findByMembreId(membreId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AbonnementResponse findById(Long id) {
        return toResponse(abonnementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Abonnement non trouvé avec l'id: " + id)));
    }

    public AbonnementResponse create(AbonnementRequest request) {
        Membre membre = membreRepository.findById(request.getMembreId())
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé avec l'id: " + request.getMembreId()));
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan non trouvé avec l'id: " + request.getPlanId()));

        Abonnement abonnement = Abonnement.builder()
                .membre(membre)
                .plan(plan)
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateDebut().plusMonths(plan.getDureeMois()))
                .notes(request.getNotes())
                .build();
        return toResponse(abonnementRepository.save(abonnement));
    }

    public void delete(Long id) {
        if (!abonnementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Abonnement non trouvé avec l'id: " + id);
        }
        abonnementRepository.deleteById(id);
    }

    private AbonnementResponse toResponse(Abonnement a) {
        return AbonnementResponse.builder()
                .id(a.getId())
                .membreId(a.getMembre().getId())
                .membreNomComplet(a.getMembre().getPrenom() + " " + a.getMembre().getNom())
                .planId(a.getPlan().getId())
                .planNom(a.getPlan().getNom())
                .dateDebut(a.getDateDebut())
                .dateFin(a.getDateFin())
                .statut(a.getStatut())
                .notes(a.getNotes())
                .build();
    }
}