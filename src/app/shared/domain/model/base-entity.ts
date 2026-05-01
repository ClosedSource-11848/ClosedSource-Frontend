/**
 * Base entity interface for all QualiTrack domain entities.
 * @remarks Uses string UUID as identifier to align with the Spring Boot
 * backend that generates UUIDs (VARCHAR(36)) for all entity IDs.
 * @author QualiTrack
 */
export interface BaseEntity {
  id: string;
}
