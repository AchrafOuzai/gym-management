package com.example.gymapi.service;

import com.example.gymapi.dto.request.EquipementRequest;
import com.example.gymapi.dto.response.EquipementResponse;
import com.example.gymapi.entity.Equipement;
import com.example.gymapi.enums.EtatEquipement;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.EquipementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipementService {

    private final EquipementRepository equipementRepository;

    public List<EquipementResponse> findAll() {
        return equipementRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<EquipementResponse> findEnMaintenance() {
        return equipementRepository.findByEtat(EtatEquipement.EN_MAINTENANCE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EquipementResponse findById(Long id) {
        return toResponse(equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé avec l'id: " + id)));
    }

    public EquipementResponse create(EquipementRequest request) {
        Equipement equipement = Equipement.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .marque(request.getMarque())
                .modele(request.getModele())
                .quantite(request.getQuantite())
                .etat(request.getEtat() != null ? request.getEtat() : EtatEquipement.BON_ETAT)
                .dateAchat(request.getDateAchat())
                .dateDerniereRevision(request.getDateDerniereRevision())
                .salle(request.getSalle())
                .build();
        return toResponse(equipementRepository.save(equipement));
    }

    public EquipementResponse update(Long id, EquipementRequest request) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement non trouvé avec l'id: " + id));
        equipement.setNom(request.getNom());
        equipement.setDescription(request.getDescription());
        equipement.setMarque(request.getMarque());
        equipement.setModele(request.getModele());
        equipement.setQuantite(request.getQuantite());
        if (request.getEtat() != null) equipement.setEtat(request.getEtat());
        equipement.setDateAchat(request.getDateAchat());
        equipement.setDateDerniereRevision(request.getDateDerniereRevision());
        equipement.setSalle(request.getSalle());
        return toResponse(equipementRepository.save(equipement));
    }

    public void delete(Long id) {
        if (!equipementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Équipement non trouvé avec l'id: " + id);
        }
        equipementRepository.deleteById(id);
    }

    private EquipementResponse toResponse(Equipement e) {
        return EquipementResponse.builder()
                .id(e.getId())
                .nom(e.getNom())
                .description(e.getDescription())
                .marque(e.getMarque())
                .modele(e.getModele())
                .quantite(e.getQuantite())
                .etat(e.getEtat())
                .dateAchat(e.getDateAchat())
                .dateDerniereRevision(e.getDateDerniereRevision())
                .salle(e.getSalle())
                .build();
    }
}