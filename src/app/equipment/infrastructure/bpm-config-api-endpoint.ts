import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { BpmConfigResource, BpmConfigsResponse } from './bpm-config-response';
import { BpmConfigAssembler } from './bpm-config-assembler';
import { ConfigureBpmRequest } from './bpm-config.request';

/**
 * The base endpoint URL used to access equipment-related API resources.
 *
 * @remarks
 * This URL is built using the server base path and the equipment endpoint path
 * defined in the application environment configuration.
 */
const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

/**
 * API endpoint responsible for managing BPM parameter configurations.
 *
 * @remarks
 * This class provides infrastructure-level operations for retrieving and
 * configuring BPM parameter limits associated with equipment.
 *
 * It extends BaseApiEndpoint to reuse common HTTP operations, error handling,
 * endpoint configuration, and assembler-based transformation between API
 * resources and domain entities.
 *
 * The endpoint works with BPM parameter configuration resources and converts
 * them into BpmParameterConfig domain entities using BpmConfigAssembler.
 *
 * @example
 * ```typescript
 * const endpoint = new BpmConfigApiEndpoint(httpClient);
 *
 * endpoint.getConfigByEquipment(101).subscribe((configs) => {
 * console.log(configs);
 * });
 *
 * endpoint.configureBpm({
 * equipmentId: 101,
 * parameterName: 'Temperature',
 * minValue: 20,
 * maxValue: 80,
 * unit: '°C'
 * }).subscribe((config) => {
 * console.log(config);
 * });
 * ```
 */
export class BpmConfigApiEndpoint extends BaseApiEndpoint<
  BpmParameterConfig,
  BpmConfigResource,
  BpmConfigsResponse,
  BpmConfigAssembler
> {
  /**
   * Creates a new BpmConfigApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests.
   *
   * @remarks
   * The constructor initializes the base API endpoint with the HTTP client,
   * the equipment endpoint URL, and a BPM configuration assembler.
   */
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new BpmConfigAssembler());
  }

  /**
   * Retrieves BPM parameter configurations for a specific equipment.
   *
   * @param equipmentId - The unique numeric identifier of the equipment.
   * @returns An Observable containing a list of BpmParameterConfig entities.
   *
   * @remarks
   * This method sends a GET request to the equipment BPM configuration endpoint.
   * The API response is transformed into domain entities through the assembler.
   *
   * If the request fails, the error is handled using the inherited handleError
   * method from BaseApiEndpoint.
   */
  getConfigByEquipment(equipmentId: number): Observable<BpmParameterConfig[]> {
    return this.http.get<BpmConfigsResponse>(`${this.endpointUrl}/${equipmentId}/bpm-config`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch BPM config for equipment ${equipmentId}`)),
    );
  }

  /**
   * Configures BPM parameter limits for an equipment.
   *
   * @param request - The request data required to configure BPM parameters.
   * @returns An Observable containing the created or updated BpmParameterConfig entity.
   *
   * @remarks
   * This method sends a POST request with the BPM configuration data.
   * The returned API resource is converted into a BpmParameterConfig domain
   * entity using the assembler.
   *
   * If the request fails, the error is handled using the inherited handleError
   * method from BaseApiEndpoint.
   */
  configureBpm(request: ConfigureBpmRequest): Observable<BpmParameterConfig> {
    return this.http.post<BpmConfigResource>(`${this.endpointUrl}/bpm-config`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to configure BPM parameters')),
    );
  }
}
