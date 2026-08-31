package com.example.gymapi.service;

import com.example.gymapi.dto.request.ProgrammeRequest;
import com.example.gymapi.dto.response.ProgrammeResponse;
import com.example.gymapi.entity.Coach;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.ProgrammeEntrainement;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.CoachRepository;
import com.example.gymapi.repository.MembreRepository;
import com.example.gymapi.repository.ProgrammeEntrainementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgrammeService {

    private final ProgrammeEntrainementRepository programmeRepository;
    private final MembreRepository membreRepository;
    private final CoachRepository coachRepository;

    public List<ProgrammeResponse> findByMembre(Long membreId) {
        return programmeRepository.findByMembreId(membreId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProgrammeResponse> findByCoach(Long coachId) {
        return programmeRepository.findByCoachId(coachId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProgrammeResponse findById(Long id) {
        return toResponse(programmeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programme non trouvé avec l'id: " + id)));
    }

    public ProgrammeResponse create(ProgrammeRequest request) {
        Membre membre = membreRepository.findById(request.getMembreId())
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé"));
        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé"));

        ProgrammeEntrainement programme = ProgrammeEntrainement.builder()
                .membre(membre)
                .coach(coach)
                .titre(request.getTitre())
                .description(request.getDescription())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .contenu(request.getContenu())
                .build();

        return toResponse(programmeRepository.save(programme));
    }

    public ProgrammeResponse update(Long id, ProgrammeRequest request) {
        ProgrammeEntrainement programme = programmeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programme non trouvé avec l'id: " + id));
        programme.setTitre(request.getTitre());
        programme.setDescription(request.getDescription());
        programme.setDateDebut(request.getDateDebut());
        programme.setDateFin(request.getDateFin());
        programme.setContenu(request.getContenu());
        return toResponse(programmeRepository.save(programme));
    }

    public void delete(Long id) {
        if (!programmeRepository.existsById(id))
            throw new ResourceNotFoundException("Programme non trouvé avec l'id: " + id);
        programmeRepository.deleteById(id);
    }

    private ProgrammeResponse toResponse(ProgrammeEntrainement p) {
        return ProgrammeResponse.builder()
                .id(p.getId())
                .membreId(p.getMembre().getId())
                .membreNomComplet(p.getMembre().getPrenom() + " " + p.getMembre().getNom())
                .coachId(p.getCoach().getId())
                .coachNomComplet(p.getCoach().getPrenom() + " " + p.getCoach().getNom())
                .titre(p.getTitre())
                .description(p.getDescription())
                .dateDebut(p.getDateDebut())
                .dateFin(p.getDateFin())
                .contenu(p.getContenu())
                .actif(p.getActif())
                .build();
    }
}