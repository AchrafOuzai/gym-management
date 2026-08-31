// ─── Enums ───────────────────────────────────────────────
export type Role             = 'ADMIN' | 'COACH' | 'MEMBRE';
export type StatutMembre     = 'ACTIF' | 'INACTIF' | 'SUSPENDU';
export type StatutAbonnement = 'ACTIF' | 'EXPIRE' | 'ANNULE' | 'EN_ATTENTE';
export type TypeSeance       = 'CARDIO' | 'MUSCULATION' | 'YOGA' | 'PILATES' | 'ZUMBA' | 'BOXE' | 'CROSSFIT';
export type EtatEquipement   = 'BON_ETAT' | 'EN_MAINTENANCE' | 'HORS_SERVICE';

// ─── Auth ─────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

// ─── Membre ───────────────────────────────────────────────
export interface MembreRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  dateInscription: string;
}

export interface MembreResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  dateInscription: string;
  statut: StatutMembre;
}

// ─── Coach ────────────────────────────────────────────────
export interface CoachRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  bio?: string;
  dateEmbauche: string;
  specialites: TypeSeance[];
}

export interface CoachResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  bio?: string;
  dateEmbauche: string;
  specialites: TypeSeance[];
  actif: boolean;
}

// ─── Plan ─────────────────────────────────────────────────
export interface PlanRequest {
  nom: string;
  description?: string;
  dureeMois: number;
  prix: number;
  nombreSeancesIncluses?: number;
  accesPiscine?: boolean;
  accesCoach?: boolean;
}

export interface PlanResponse {
  id: number;
  nom: string;
  description?: string;
  dureeMois: number;
  prix: number;
  nombreSeancesIncluses?: number;
  accesPiscine?: boolean;
  accesCoach?: boolean;
  actif: boolean;
}

// ─── Abonnement ───────────────────────────────────────────
export interface AbonnementRequest {
  membreId: number;
  planId: number;
  dateDebut: string;
  notes?: string;
}

export interface AbonnementResponse {
  id: number;
  membreId: number;
  membreNomComplet: string;
  planId: number;
  planNom: string;
  dateDebut: string;
  dateFin: string;
  statut: StatutAbonnement;
  notes?: string;
}

// ─── Seance ───────────────────────────────────────────────
export interface SeanceRequest {
  titre: string;
  description?: string;
  type: TypeSeance;
  dateHeure: string;
  dureeMinutes: number;
  capaciteMax: number;
  salle?: string;
  coachId?: number;
}

export interface SeanceResponse {
  id: number;
  titre: string;
  description?: string;
  type: TypeSeance;
  dateHeure: string;
  dureeMinutes: number;
  capaciteMax: number;
  placesRestantes: number;
  salle?: string;
  coachId?: number;
  coachNomComplet?: string;
}

// ─── Equipement ───────────────────────────────────────────
export interface EquipementRequest {
  nom: string;
  description?: string;
  marque?: string;
  modele?: string;
  quantite: number;
  etat?: EtatEquipement;
  dateAchat?: string;
  dateDerniereRevision?: string;
  salle?: string;
}

export interface EquipementResponse {
  id: number;
  nom: string;
  description?: string;
  marque?: string;
  modele?: string;
  quantite: number;
  etat: EtatEquipement;
  dateAchat?: string;
  dateDerniereRevision?: string;
  salle?: string;
}
// ─── Paiement ─────────────────────────────────────────────
export type StatutPaiement = 'EN_ATTENTE' | 'PAYE' | 'EN_RETARD' | 'ANNULE';
export type StatutReservation = 'CONFIRMEE' | 'ANNULEE' | 'EN_ATTENTE' | 'LISTE_ATTENTE';
export type TypeNotification = 'ABONNEMENT_EXPIRE_BIENTOT' | 'ABONNEMENT_EXPIRE' |
  'PAIEMENT_EN_RETARD' | 'SEANCE_ANNULEE' | 'RESERVATION_CONFIRMEE' | 'BIENVENUE';

export interface PaiementRequest {
  membreId: number;
  abonnementId: number;
  montant: number;
  dateEcheance: string;
  datePaiement?: string;
  methodePaiement?: string;
  notes?: string;
}

export interface PaiementResponse {
  id: number;
  membreId: number;
  membreNomComplet: string;
  abonnementId: number;
  montant: number;
  datePaiement?: string;
  dateEcheance: string;
  statut: StatutPaiement;
  methodePaiement?: string;
  notes?: string;
}

export interface ReservationRequest {
  membreId: number;
  seanceId: number;
}

export interface ReservationResponse {
  id: number;
  membreId: number;
  membreNomComplet: string;
  seanceId: number;
  seanceTitre: string;
  dateReservation: string;
  seanceDateHeure: string;
  statut: StatutReservation;
  dateAnnulation?: string;
  motifAnnulation?: string;
}

export interface PresenceRequest {
  membreId: number;
  seanceId: number;
  dateHeureArrivee: string;
  dateHeureDepart?: string;
  present: boolean;
}

export interface PresenceResponse {
  id: number;
  membreId: number;
  membreNomComplet: string;
  seanceId: number;
  seanceTitre: string;
  dateHeureArrivee: string;
  dateHeureDepart?: string;
  present: boolean;
}

export interface NotificationResponse {
  id: number;
  membreId: number;
  type: TypeNotification;
  titre: string;
  message: string;
  dateCreation: string;
  lue: boolean;
}

export interface ProgrammeRequest {
  membreId: number;
  coachId: number;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  contenu?: string;
}

export interface ProgrammeResponse {
  id: number;
  membreId: number;
  membreNomComplet: string;
  coachId: number;
  coachNomComplet: string;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  contenu?: string;
  actif: boolean;
}

export interface DashboardStats {
  totalMembres: number;
  membresActifs: number;
  membersSuspendus: number;
  revenusMois: number;
  paiementsEnRetard: number;
  abonnementsExpirantBientot: number;
  totalSeances: number;
  seancesDisponibles: number;
  totalCoachs: number;
  coachsActifs: number;
  totalEquipements: number;
  equipementsEnMaintenance: number;
}
export interface ChartData {
  labels: string[];
  values: number[];
  titre: string;
}