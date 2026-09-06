package com.example.gymapi.service;

import com.example.gymapi.dto.request.CoachRequest;
import com.example.gymapi.dto.response.CoachResponse;
import com.example.gymapi.entity.Coach;
import com.example.gymapi.entity.User;
import com.example.gymapi.enums.Role;
import com.example.gymapi.exception.EmailAlreadyExistsException;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.CoachRepository;
import com.example.gymapi.repository.ProgrammeEntrainementRepository;
import com.example.gymapi.repository.SeanceRepository;
import com.example.gymapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CoachService {

    private final CoachRepository coachRepository;
    private final UserRepository userRepository;
    private final SeanceRepository seanceRepository;
    private final ProgrammeEntrainementRepository programmeRepository;
    private final PasswordEncoder passwordEncoder;

    public List<CoachResponse> findAll() {
        return coachRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CoachResponse> findActifs() {
        return coachRepository.findByActifTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CoachResponse findById(Long id) {
        return toResponse(coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Coach non trouvé avec l'id: " + id)));
    }

    public CoachResponse create(CoachRequest request) {
        if (coachRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        // Créer le compte User pour que le coach puisse se connecter
        if (!userRepository.existsByEmail(request.getEmail())) {
            String defaultPassword = request.getEmail().split("@")[0] + "123";
            User user = User.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(defaultPassword))
                    .role(Role.COACH)
                    .build();
            userRepository.save(user);
        }

        // Créer le profil Coach
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
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Coach non trouvé avec l'id: " + id));
        if (!coach.getEmail().equals(request.getEmail())
                && coachRepository.existsByEmail(request.getEmail())) {
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
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Coach non trouvé avec l'id: " + id));
        coach.setActif(false);
        coachRepository.save(coach);

        // Désactiver aussi le compte User
        userRepository.findByEmail(coach.getEmail()).ifPresent(u -> {
            // On pourrait ajouter un champ 'enabled' sur User
            // Pour l'instant on garde juste le coach inactif
        });
    }

    public void delete(Long id) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Coach non trouvé avec l'id: " + id));

        // Détacher le coach des séances
        seanceRepository.findByCoachId(id).forEach(s -> {
            s.setCoach(null);
            seanceRepository.save(s);
        });

        // Supprimer les programmes
        programmeRepository.deleteAll(
            programmeRepository.findByCoachId(id));

        // Supprimer le compte User
        userRepository.findByEmail(coach.getEmail())
                .ifPresent(userRepository::delete);

        // Supprimer le coach
        coachRepository.delete(coach);
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