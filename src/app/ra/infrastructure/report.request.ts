/**
 * Data Transfer Object (DTO) for requesting the generation of a production batch report.
 *
 * @remarks
 * This interface represents the payload sent from the client application to the API
 * when initiating batch report generation. It mirrors the domain command while
 * remaining an infrastructure-level HTTP contract.
 */
export interface GenerateBatchReportRequest {
  /**
   * The unique numeric identifier of the production batch.
   */
  batchId: number;

  /**
   * Indicates whether sensor and process telemetry should be included.
   */
  includeTelemetry: boolean;

  /**
   * Indicates whether deviation alerts should be included.
   */
  includeDeviations: boolean;

  /**
   * The requested output format for the generated document.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user requesting the report.
   */
  requestedBy: number;
}

/**
 * Data Transfer Object (DTO) for requesting a regulatory compliance report.
 *
 * @remarks
 * This interface defines the HTTP payload used to generate a compliance audit
 * report for a specific laboratory over a defined period.
 */
export interface GenerateComplianceReportRequest {
  /**
   * The unique numeric identifier of the laboratory to audit.
   */
  laboratoryId: number;

  /**
   * The start date and time of the reporting period.
   */
  startDate: string;

  /**
   * The end date and time of the reporting period.
   */
  endDate: string;

  /**
   * The requested output format for the generated document.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user requesting the report.
   */
  requestedBy: number;
}

/**
 * Data Transfer Object (DTO) for requesting the export of equipment logs.
 *
 * @remarks
 * This interface represents the HTTP payload used to export historical audit
 * or operational records for a specific piece of equipment.
 */
export interface ExportEquipmentLogRequest {
  /**
   * The unique numeric identifier of the equipment.
   */
  equipmentId: number;

  /**
   * The start date and time of the exported period.
   */
  startDate: string;

  /**
   * The end date and time of the exported period.
   */
  endDate: string;

  /**
   * The requested output format for the exported file.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user requesting the export.
   */
  requestedBy: number;
}
