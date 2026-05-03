import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { environment } from '../../../environments/environment';
import { StaffMember } from '../domain/model/staff-member.entity';
import { StaffMemberResource } from './laboratory-response';
import { StaffAssembler } from './staff-assembler';
import { RegisterStaffRequest } from './laboratory.request';

const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

export class StaffApiEndpoint extends BaseApiEndpoint<
  StaffMember,
  StaffMemberResource,
  BaseResponse,
  StaffAssembler
> {
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new StaffAssembler());
  }

  getStaffByLab(labId: string): Observable<StaffMember[]> {
    return this.http.get<StaffMemberResource[]>(`${this.endpointUrl}/${labId}/staff`).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch staff for lab ${labId}`)),
    );
  }

  registerStaff(labId: string, request: RegisterStaffRequest): Observable<StaffMember> {
    return this.http.post<StaffMemberResource>(`${this.endpointUrl}/${labId}/staff`, request).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to register staff member')),
    );
  }

  deactivateStaff(labId: string, staffId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.endpointUrl}/${labId}/staff/${staffId}`)
      .pipe(catchError(this.handleError(`Failed to deactivate staff member ${staffId}`)));
  }
}
