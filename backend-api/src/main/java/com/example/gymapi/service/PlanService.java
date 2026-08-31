package com.example.gymapi.service;

import com.example.gymapi.dto.request.PlanRequest;
import com.example.gymapi.dto.response.PlanResponse;
import com.example.gymapi.entity.Plan;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanResponse> findAll() {
        return planRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PlanResponse> findActifs() {
        return planRepository.findByActifTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PlanResponse findById(Long id) {
        return toResponse(planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan non trouvé avec l'id: " + id)));
    }

    public PlanResponse create(PlanRequest request) {
        Plan plan = Plan.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .dureeMois(request.getDureeMois())
                .prix(request.getPrix())
                .nombreSeancesIncluses(request.getNombreSeancesIncluses())
                .accesPiscine(request.getAccesPiscine())
                .accesCoach(request.getAccesCoach())
                .build();
        return toResponse(planRepository.save(plan));
    }

    public PlanResponse update(Long id, PlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan non trouvé avec l'id: " + id));
        plan.setNom(request.getNom());
        plan.setDescription(request.getDescription());
        plan.setDureeMois(request.getDureeMois());
        plan.setPrix(request.getPrix());
        plan.setNombreSeancesIncluses(request.getNombreSeancesIncluses());
        plan.setAccesPiscine(request.getAccesPiscine());
        plan.setAccesCoach(request.getAccesCoach());
        return toResponse(planRepository.save(plan));
    }

    public void delete(Long id) {
        if (!planRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plan non trouvé avec l'id: " + id);
        }
        planRepository.deleteById(id);
    }

    private PlanResponse toResponse(Plan p) {
        return PlanResponse.builder()
                .id(p.getId())
                .nom(p.getNom())
                .description(p.getDescription())
                .dureeMois(p.getDureeMois())
                .prix(p.getPrix())
                .nombreSeancesIncluses(p.getNombreSeancesIncluses())
                .accesPiscine(p.getAccesPiscine())
                .accesCoach(p.getAccesCoach())
                .actif(p.getActif())
                .build();
    }
}