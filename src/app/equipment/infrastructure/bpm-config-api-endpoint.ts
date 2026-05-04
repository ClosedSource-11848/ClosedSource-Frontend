import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { BpmParameterConfig } from '../domain/model/bpm-parameter-config.entity';
import { BpmConfigResource } from './equipment-response';
import { BpmConfigAssembler } from './bpm-config-assembler';
import { ConfigureBpmRequest } from './equipment.request';

const equipmentEndpointUrl = `${environment.serverBasePath}${environment.equipmentEndpointPath}`;

export class BpmConfigApiEndpoint extends BaseApiEndpoint<
  BpmParameterConfig,
  BpmConfigResource,
  BaseResponse,
  BpmConfigAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentEndpointUrl, new BpmConfigAssembler());
  }

  getConfigByEquipment(equipmentId: string): Observable<BpmParameterConfig[]> {
    return this.http.get<BpmConfigResource[]>(`${this.endpointUrl}/${equipmentId}/bpm-config`).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
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
