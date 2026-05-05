export interface ConfigureBpmRequest {
  equipmentId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  unit: string;
}
