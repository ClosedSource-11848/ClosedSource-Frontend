import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { BpmConfigResource, BpmConfigsResponse } from './bpm-config-response';
import { BpmConfigAssembler } from './bpm-config-assembler';
import { ConfigureBpmRequest } from './bpm-config.request';

const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class BpmConfigApiEndpoint extends BaseApiEndpoint<
  BpmParameterConfig,
  BpmConfigResource,
  BpmConfigsResponse,
  BpmConfigAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new BpmConfigAssembler());
  }

  getConfigByEquipment(equipmentId: string): Observable<BpmParameterConfig[]> {
    return this.http.get<BpmConfigsResponse>(`${this.endpointUrl}/${equipmentId}/bpm-config`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch BPM config for equipment ${equipmentId}`)),
    );
  }

  configureBpm(request: ConfigureBpmRequest): Observable<BpmParameterConfig> {
    return this.http.post<BpmConfigResource>(`${this.endpointUrl}/bpm-config`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to configure BPM parameters')),
    );
  }
}
