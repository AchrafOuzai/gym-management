package com.example.gymapi.service;

import com.example.gymapi.dto.request.MembreRequest;
import com.example.gymapi.dto.response.MembreResponse;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.exception.EmailAlreadyExistsException;
import com.example.gymapi.exception.ResourceNotFoundException;
import com.example.gymapi.repository.MembreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MembreService {

    private final MembreRepository membreRepository;

    public List<MembreResponse> findAll() {
        return membreRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MembreResponse findById(Long id) {
        return toResponse(membreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé avec l'id: " + id)));
    }

    public MembreResponse create(MembreRequest request) {
        if (membreRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        Membre membre = Membre.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .dateNaissance(request.getDateNaissance())
                .dateInscription(request.getDateInscription())
                .build();
        return toResponse(membreRepository.save(membre));
    }

    public MembreResponse update(Long id, MembreRequest request) {
        Membre membre = membreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membre non trouvé avec l'id: " + id));
        if (!membre.getEmail().equals(request.getEmail()) && membreRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        membre.setNom(request.getNom());
        membre.setPrenom(request.getPrenom());
        membre.setEmail(request.getEmail());
        membre.setTelephone(request.getTelephone());
        membre.setDateNaissance(request.getDateNaissance());
        membre.setDateInscription(request.getDateInscription());
        return toResponse(membreRepository.save(membre));
    }

    public void delete(Long id) {
        if (!membreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membre non trouvé avec l'id: " + id);
        }
        membreRepository.deleteById(id);
    }

    public List<MembreResponse> search(String keyword) {
        return membreRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(keyword, keyword)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private MembreResponse toResponse(Membre m) {
        return MembreResponse.builder()
                .id(m.getId())
                .nom(m.getNom())
                .prenom(m.getPrenom())
                .email(m.getEmail())
                .telephone(m.getTelephone())
                .dateNaissance(m.getDateNaissance())
                .dateInscription(m.getDateInscription())
                .statut(m.getStatut())
                .build();
    }
}