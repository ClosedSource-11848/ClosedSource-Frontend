/**
 * Data Transfer Object (DTO) for requesting the generation of a production batch report.
 *
 * @remarks
 * This interface represents the payload sent from the client application to the API
 * when initiating a batch report generation. It acts as the infrastructure-level
 * counterpart to the GenerateBatchReportCommand in the application layer.
 */
export interface GenerateBatchReportRequest {
  /**
   * The unique numeric identifier of the production batch.
   */
  batchId: number;

  /**
   * Flag indicating whether to include sensor and process telemetry data.
   */
  includeTelemetry: boolean;

  /**
   * Flag indicating whether to include logged deviation alerts.
   */
  includeDeviations: boolean;

  /**
   * The requested output format for the generated document.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user or system requesting the report.
   */
  requestedBy: number;
}

/**
 * Data Transfer Object (DTO) for requesting a regulatory compliance report.
 *
 * @remarks
 * This interface defines the expected JSON payload from the client to initiate
 * the generation of a compliance audit report for a specific laboratory over a
 * defined time period.
 */
export interface GenerateComplianceReportRequest {
  /**
   * The unique numeric identifier of the laboratory to audit.
   */
  labId: number;

  /**
   * The start date and time of the reporting period (ISO string format).
   */
  startDate: string;

  /**
   * The end date and time of the reporting period (ISO string format).
   */
  endDate: string;

  /**
   * The requested output format for the generated document.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user or system requesting the report.
   */
  requestedBy: number;
}

/**
 * Data Transfer Object (DTO) for requesting the export of equipment logs.
 *
 * @remarks
 * This interface dictates the structure of the API request used to trigger
 * the extraction of historical maintenance and operational logs for a specific
 * piece of equipment.
 */
export interface ExportEquipmentLogRequest {
  /**
   * The unique numeric identifier of the equipment.
   */
  equipmentId: number;

  /**
   * The start date and time of the logging period (ISO string format).
   */
  startDate: string;

  /**
   * The end date and time of the logging period (ISO string format).
   */
  endDate: string;

  /**
   * The requested output format for the exported logs.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user or system requesting the export.
   */
  requestedBy: number;
}
