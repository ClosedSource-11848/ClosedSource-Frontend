/**
 * Command to trigger the generation of a regulatory compliance report for a laboratory.
 *
 * @remarks
 * In Domain-Driven Design, this interface represents a command pattern used
 * to request a compliance audit report. It specifies the target laboratory,
 * the time window for the report, the desired output format, and the requester's
 * identity.
 *
 * This command is processed by application services to gather audit trails
 * and compliance events for the specified laboratory.
 */
export interface GenerateComplianceReportCommand {
  /**
   * The unique numeric identifier of the laboratory.
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
