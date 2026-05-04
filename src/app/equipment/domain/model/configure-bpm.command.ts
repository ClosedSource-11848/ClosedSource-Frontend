export interface ConfigureBpmCommand {
  equipmentId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  unit: string;
}
