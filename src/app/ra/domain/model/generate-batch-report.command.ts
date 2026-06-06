/**
 * Command to trigger the generation of a production batch report.
 *
 * @remarks
 * In Domain-Driven Design, this interface represents a command pattern used
 * to encapsulate the instructions for generating an operational report.
 * It specifies the target batch, data inclusions (telemetry and deviations),
 * the output format, and the requester's identity.
 *
 * This command is typically sent to an application service that coordinates
 * the report assembly process.
 */
export interface GenerateBatchReportCommand {
  /**
   * The unique numeric identifier of the production batch.
   */
  batchId: number;

  /**
   * Flag indicating whether to include sensor/process telemetry in the report.
   */
  includeTelemetry: boolean;

  /**
   * Flag indicating whether to include logged deviation alerts in the report.
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
