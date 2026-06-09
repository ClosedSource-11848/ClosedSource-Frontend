import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { StaffMember } from '../domain/model/staff-member.entity';
import { StaffMemberResource, StaffMembersResponse } from './staff-response';
import { StaffAssembler } from './staff-assembler';
import { RegisterStaffRequest } from './staff.request';
import { MessageResource } from '../../shared/infrastructure/message-response';

/**
 * Base URL for all laboratory-related HTTP endpoints, composed from the
 * server base path and the laboratory-specific path defined in the
 * environment configuration. Resolved once at module load time.
 */
const labEndpointUrl = `${environment.serverBasePath}${environment.laboratoryLabsEndpointPath}`;

/**
 * HTTP endpoint handler for staff member operations within the Laboratory domain.
 *
 * @remarks
 * `StaffApiEndpoint` extends {@link BaseApiEndpoint} specializing it with
 * {@link StaffMember} as the domain entity, {@link StaffMemberResource} as the
 * single resource shape, {@link StaffMembersResponse} as the collection response
 * shape, and {@link StaffAssembler} for mapping between both representations.
 *
 * This class is not managed by Angular's DI container and is instantiated
 * directly by {@link LaboratoryApi}, which owns its lifecycle and provides
 * the shared {@link HttpClient} instance. Each method maps the raw API resource
 * to a domain entity via the assembler and delegates error handling to the
 * base class `handleError` utility.
 *
 * @example
 * ```typescript
 * const endpoint = new StaffApiEndpoint(http);
 * endpoint.getStaffByLab(123).subscribe(staff => console.log(staff.length));
 * ```
 */
export class StaffApiEndpoint extends BaseApiEndpoint<
  StaffMember,
  StaffMemberResource,
  StaffMembersResponse,
  StaffAssembler
> {
  /**
   * Creates an instance of `StaffApiEndpoint`.
   *
   * @param http - The Angular `HttpClient` instance forwarded from {@link LaboratoryApi},
   * passed to the base class to perform HTTP requests.
   *
   * @remarks
   * The {@link StaffAssembler} is instantiated here rather than injected,
   * as this class operates outside Angular's DI container.
   */
  constructor(http: HttpClient) {
    super(http, labEndpointUrl, new StaffAssembler());
  }

  /**
   * Retrieves all staff members associated with a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory whose staff to retrieve.
   * @returns An `Observable` that emits an array of {@link StaffMember} domain
   * entities mapped from the server response.
   *
   * @remarks
   * Performs an HTTP `GET` to `{labEndpointUrl}/{labId}/staff`. The raw
   * {@link StaffMembersResponse} is mapped via
   * {@link StaffAssembler.toEntitiesFromResponse}. Errors are forwarded
   * through the base class error handler.
   */
  getStaffByLab(labId: number): Observable<StaffMember[]> {
    return this.http.get<StaffMemberResource[]>(`${this.endpointUrl}/${labId}/staff`).pipe(
      map((resources) =>
        resources.map((resource) => this.assembler.toEntityFromResource(resource)),
      ),
      catchError(this.handleError(`Failed to fetch staff for lab ${labId}`)),
    );
  }

  /**
   * Registers a new staff member under a specific laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory to register the staff member under.
   * @param request - The {@link RegisterStaffRequest} payload containing the
   * new staff member's profile information.
   * @returns An `Observable` that emits the newly created {@link StaffMember}
   * domain entity as returned by the server.
   *
   * @remarks
   * Performs an HTTP `POST` to `{labEndpointUrl}/{labId}/staff` with the request
   * body serialized as JSON. The server is expected to return the created
   * {@link StaffMemberResource}, which is then mapped via
   * {@link StaffAssembler.toEntityFromResource}. Errors are forwarded through
   * the base class error handler.
   */
  registerStaff(labId: number, request: RegisterStaffRequest): Observable<MessageResource> {
    return this.http
      .post<MessageResource>(`${this.endpointUrl}/${labId}/staff`, request)
      .pipe(catchError(this.handleError('Failed to register staff member')));
  }

  /**
   * Deactivates an existing staff member within a laboratory.
   *
   * @param labId - The unique numeric identifier of the laboratory the staff member belongs to.
   * @param staffId - The unique numeric identifier of the staff member to deactivate.
   * @returns An `Observable` that completes when the deactivation has been
   * successfully processed by the server.
   *
   * @remarks
   * Performs an HTTP `DELETE` to `{labEndpointUrl}/{labId}/staff/{staffId}`.
   * Deactivation does not delete the record — it is retained for historical
   * traceability including authorship on past audit entries and batch approvals.
   * See {@link StaffMember.active} for details. Errors are forwarded through
   * the base class error handler.
   */
  deactivateStaff(labId: number, staffId: number): Observable<void> {
    const staffEndpointUrl = `${environment.serverBasePath}${environment.laboratoryStaffEndpointPath}`;

    return this.http
      .put<void>(`${staffEndpointUrl}/${staffId}/deactivation`, {})
      .pipe(catchError(this.handleError(`Failed to deactivate staff member ${staffId}`)));
  }
}
