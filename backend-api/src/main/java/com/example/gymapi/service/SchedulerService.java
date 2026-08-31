package com.example.gymapi.service;

import com.example.gymapi.entity.Abonnement;
import com.example.gymapi.entity.Membre;
import com.example.gymapi.entity.Notification;
import com.example.gymapi.entity.Paiement;
import com.example.gymapi.enums.StatutAbonnement;
import com.example.gymapi.enums.StatutMembre;
import com.example.gymapi.enums.StatutPaiement;
import com.example.gymapi.enums.TypeNotification;
import com.example.gymapi.repository.AbonnementRepository;
import com.example.gymapi.repository.MembreRepository;
import com.example.gymapi.repository.NotificationRepository;
import com.example.gymapi.repository.PaiementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SchedulerService {

    private final AbonnementRepository abonnementRepository;
    private final MembreRepository membreRepository;
    private final PaiementRepository paiementRepository;
    private final NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 8 * * *")
    public void verifierAbonnementsExpires() {
        log.info("⏰ Scheduler : vérification des abonnements expirés");
        LocalDate today = LocalDate.now();

        List<Abonnement> expires = abonnementRepository.findAbonnementsExpires(today);
        expires.forEach(a -> {
            a.setStatut(StatutAbonnement.EXPIRE);
            abonnementRepository.save(a);

            Membre membre = a.getMembre();
            membre.setStatut(StatutMembre.SUSPENDU);
            membreRepository.save(membre);

            creerNotification(membre,
                TypeNotification.ABONNEMENT_EXPIRE,
                "Abonnement expiré",
                "Votre abonnement " + a.getPlan().getNom() +
                " a expiré le " + a.getDateFin() +
                ". Renouvelez-le pour continuer à profiter de nos services.");

            log.info("✅ Abonnement {} expiré — membre {} suspendu",
                a.getId(), membre.getEmail());
        });
    }

    @Scheduled(cron = "0 0 9 * * *")
    public void alerterAbonnementsExpirantBientot() {
        log.info("⏰ Scheduler : alertes expiration dans 7 jours");
        LocalDate today = LocalDate.now();
        LocalDate in7days = today.plusDays(7);

        List<Abonnement> expirantBientot =
            abonnementRepository.findAbonnementsExpirantBientot(today, in7days);

        expirantBientot.forEach(a ->
            creerNotification(a.getMembre(),
                TypeNotification.ABONNEMENT_EXPIRE_BIENTOT,
                "Abonnement expire bientôt",
                "Votre abonnement " + a.getPlan().getNom() +
                " expire le " + a.getDateFin() +
                ". Pensez à le renouveler !")
        );

        log.info("✅ {} alertes d'expiration envoyées", expirantBientot.size());
    }

    @Scheduled(cron = "0 0 10 * * *")
    public void verifierPaiementsEnRetard() {
        log.info("⏰ Scheduler : vérification des paiements en retard");
        LocalDate today = LocalDate.now();

        List<Paiement> enRetard = paiementRepository.findPaiementsEnRetard(today);
        enRetard.forEach(p -> {
            p.setStatut(StatutPaiement.EN_RETARD);
            paiementRepository.save(p);

            if (p.getDateEcheance().isBefore(today.minusDays(30))) {
                Membre membre = p.getMembre();
                membre.setStatut(StatutMembre.SUSPENDU);
                membreRepository.save(membre);

                creerNotification(membre,
                    TypeNotification.PAIEMENT_EN_RETARD,
                    "Compte suspendu — paiement en retard",
                    "Votre compte a été suspendu suite à un retard de paiement " +
                    "de " + p.getMontant() + " MAD. Contactez l'administration.");
            } else {
                creerNotification(p.getMembre(),
                    TypeNotification.PAIEMENT_EN_RETARD,
                    "Paiement en retard",
                    "Un paiement de " + p.getMontant() + " MAD était dû le " +
                    p.getDateEcheance() + ". Régularisez votre situation.");
            }
        });

        log.info("✅ {} paiements marqués en retard", enRetard.size());
    }

    @Scheduled(cron = "0 0 7 1 * *")
    public void genererPaiementsMensuels() {
        log.info("⏰ Scheduler : génération des paiements mensuels");
        LocalDate today = LocalDate.now();

        List<Abonnement> abonnementsActifs =
            abonnementRepository.findByStatut(StatutAbonnement.ACTIF);

        abonnementsActifs.forEach(a -> {
            Paiement paiement = Paiement.builder()
                    .membre(a.getMembre())
                    .abonnement(a)
                    .montant(a.getPlan().getPrix())
                    .dateEcheance(today.plusDays(7))
                    .statut(StatutPaiement.EN_ATTENTE)
                    .notes("Paiement mensuel généré automatiquement — " +
                           today.getMonth() + " " + today.getYear())
                    .build();
            paiementRepository.save(paiement);
        });

        log.info("✅ {} paiements mensuels générés", abonnementsActifs.size());
    }

    private void creerNotification(Membre membre, TypeNotification type,
                                    String titre, String message) {
        boolean dejaNotifie = notificationRepository
                .findByMembreIdAndLueFalse(membre.getId())
                .stream()
                .anyMatch(n -> n.getType() == type &&
                          n.getDateCreation().toLocalDate().equals(LocalDate.now()));

        if (!dejaNotifie) {
            Notification n = Notification.builder()
                    .membre(membre)
                    .type(type)
                    .titre(titre)
                    .message(message)
                    .dateCreation(LocalDateTime.now())
                    .build();
            notificationRepository.save(n);
        }
    }
}