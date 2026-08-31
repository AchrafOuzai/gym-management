package com.example.gymapi.service;

import com.example.gymapi.dto.response.ChartDataResponse;
import com.example.gymapi.dto.response.DashboardStatsResponse;
import com.example.gymapi.enums.StatutAbonnement;
import com.example.gymapi.enums.StatutMembre;
import com.example.gymapi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final MembreRepository membreRepository;
    private final CoachRepository coachRepository;
    private final SeanceRepository seanceRepository;
    private final EquipementRepository equipementRepository;
    private final PaiementRepository paiementRepository;
    private final AbonnementRepository abonnementRepository;
    private final ReservationRepository reservationRepository;

    private static final List<String> MOIS = Arrays.asList(
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
    );

    public DashboardStatsResponse getStats() {
        LocalDate today = LocalDate.now();
        LocalDate in7days = today.plusDays(7);
        BigDecimal revenusMois = paiementRepository.sumRevenusMois(today);

        return DashboardStatsResponse.builder()
                .totalMembres(membreRepository.count())
                .membresActifs(membreRepository.countMembresActifs())
                .membersSuspendus(membreRepository.findByStatut(StatutMembre.SUSPENDU).size())
                .revenusMois(revenusMois != null ? revenusMois : BigDecimal.ZERO)
                .paiementsEnRetard(paiementRepository.countPaiementsEnRetard())
                .abonnementsExpirantBientot(
                    abonnementRepository.findAbonnementsExpirantBientot(today, in7days).size())
                .totalSeances(seanceRepository.count())
                .seancesDisponibles(
                    seanceRepository.findSeancesDisponibles(LocalDateTime.now()).size())
                .totalCoachs(coachRepository.count())
                .coachsActifs(coachRepository.findByActifTrue().size())
                .totalEquipements(equipementRepository.count())
                .equipementsEnMaintenance(0L)
                .totalReservations(reservationRepository.count())
                .reservationsAujourdhui(0L)
                .build();
    }

    public ChartDataResponse getRevenusParMois(int year) {
        List<Object[]> data = paiementRepository.sumRevenusParMois(year);
        Map<Integer, Double> map = data.stream().collect(Collectors.toMap(
            r -> ((Number) r[0]).intValue(),
            r -> ((Number) r[1]).doubleValue()
        ));
        List<Double> values = IntStream.rangeClosed(1, 12)
                .mapToObj(m -> map.getOrDefault(m, 0.0))
                .collect(Collectors.toList());
        return ChartDataResponse.builder()
                .titre("Revenus " + year + " (MAD)")
                .labels(MOIS)
                .values(values)
                .build();
    }

    public ChartDataResponse getNouveauxMembresParMois(int year) {
        List<Object[]> data = paiementRepository.countNouveauxMembresParMois(year);
        Map<Integer, Double> map = data.stream().collect(Collectors.toMap(
            r -> ((Number) r[0]).intValue(),
            r -> ((Number) r[1]).doubleValue()
        ));
        List<Double> values = IntStream.rangeClosed(1, 12)
                .mapToObj(m -> map.getOrDefault(m, 0.0))
                .collect(Collectors.toList());
        return ChartDataResponse.builder()
                .titre("Nouveaux membres " + year)
                .labels(MOIS)
                .values(values)
                .build();
    }

    public ChartDataResponse getStatutsMembers() {
        long actifs    = membreRepository.countMembresActifs();
        long suspendus = membreRepository.findByStatut(StatutMembre.SUSPENDU).size();
        long inactifs  = membreRepository.findByStatut(StatutMembre.INACTIF).size();
        return ChartDataResponse.builder()
                .titre("Répartition des membres")
                .labels(Arrays.asList("Actifs", "Suspendus", "Inactifs"))
                .values(Arrays.asList((double) actifs, (double) suspendus, (double) inactifs))
                .build();
    }
}