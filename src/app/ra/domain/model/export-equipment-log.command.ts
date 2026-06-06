/**
 * Command to trigger the export of an equipment log report.
 *
 * @remarks
 * In Domain-Driven Design, this interface represents a command pattern used
 * to request an export of historical logs for a specific piece of equipment.
 * It specifies the target equipment, the time window for the logs,
 * the desired output format, and the requester's identity.
 *
 * This command is processed by application services to compile maintenance
 * records and operational telemetry for the specified equipment.
 */
export interface ExportEquipmentLogCommand {
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
   * The requested output format for the generated document.
   */
  format: 'PDF' | 'CSV';

  /**
   * The numeric identifier of the user or system requesting the report.
   */
  requestedBy: number;
}
