import { Observable } from 'rxjs';
import { IPaginatedArray, IError, IDefaultDBItem } from '../../../common/types';

export interface IReportServiceClient {
  createReport(
    request: ICreateReportRequest,
  ): Observable<ICommonIsSuccessResponse>;

  getReports(
    request?: IGetReportsRequest,
  ): Observable<IPaginatedArray<IReport>>;

  deleteReport(
    request: IDeleteReportRequest,
  ): Observable<ICommonIsSuccessResponse>;

  updateReport(
    request: IUpdateReportRequest,
  ): Observable<ICommonIsSuccessResponse>;
}
export interface INewReport {
  entityId: string;
  subject: string;
  userId: string;
  description: string;
}

export interface IReport extends INewReport, IDefaultDBItem {}

export interface ICommonIsSuccessResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface ICreateReportRequest {
  report: INewReport;
}

export interface ICreateRatingResponse {
  isSuccess: boolean;
  error?: IError;
}

export interface IGetReportsRequest {
  reportId?: string;
  page?: number;
  perPage?: number;
}

export interface IGetReportResponse {
  reports: IReport;
  error?: IError;
}

export interface IDeleteReportRequest {
  id: string;
}

export interface IUpdateReportRequest {
  report: INewReport;
}

export interface ICommonIsSuccessResponse {
  isSuccess: boolean;
  error?: IError;
}
