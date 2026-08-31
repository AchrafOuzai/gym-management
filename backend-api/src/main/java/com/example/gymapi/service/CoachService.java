package com.example.gymapi.service;

import com.example.gymapi.dto.request.CoachRequest;
import com.example.gymapi.dto.response.CoachResponse;
import com.example.gymapi.entity.Coach;
import com.example.gymapi.exception.EmailAlreadyExistsException;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.CoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CoachService {

    private final CoachRepository coachRepository;

    public List<CoachResponse> findAll() {
        return coachRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CoachResponse> findActifs() {
        return coachRepository.findByActifTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CoachResponse findById(Long id) {
        return toResponse(coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'id: " + id)));
    }

    public CoachResponse create(CoachRequest request) {
        if (coachRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        Coach coach = Coach.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .bio(request.getBio())
                .dateEmbauche(request.getDateEmbauche())
                .specialites(request.getSpecialites())
                .build();
        return toResponse(coachRepository.save(coach));
    }

    public CoachResponse update(Long id, CoachRequest request) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'id: " + id));
        if (!coach.getEmail().equals(request.getEmail()) && coachRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        coach.setNom(request.getNom());
        coach.setPrenom(request.getPrenom());
        coach.setEmail(request.getEmail());
        coach.setTelephone(request.getTelephone());
        coach.setBio(request.getBio());
        coach.setDateEmbauche(request.getDateEmbauche());
        coach.setSpecialites(request.getSpecialites());
        return toResponse(coachRepository.save(coach));
    }

    public void desactiver(Long id) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coach non trouvé avec l'id: " + id));
        coach.setActif(false);
        coachRepository.save(coach);
    }

    public void delete(Long id) {
        if (!coachRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coach non trouvé avec l'id: " + id);
        }
        coachRepository.deleteById(id);
    }

    private CoachResponse toResponse(Coach c) {
        return CoachResponse.builder()
                .id(c.getId())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .bio(c.getBio())
                .dateEmbauche(c.getDateEmbauche())
                .specialites(c.getSpecialites())
                .actif(c.getActif())
                .build();
    }
}