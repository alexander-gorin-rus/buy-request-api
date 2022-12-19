import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import configuration from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import {
  ICommonIsSuccessResponse,
  ICreateReportRequest,
  IDeleteReportRequest,
  IGetReportsRequest,
  IReport,
  IReportServiceClient,
  IUpdateReportRequest,
} from './interfaces/report.interface';
import { IPaginatedArray } from '../../common/types';

const {
  packageNames: { REPORT_PACKAGE },
} = configuration();

@Injectable()
export class ReportService extends GrpcRequestService implements OnModuleInit {
  private reportService: IReportServiceClient;

  constructor(
    @Inject(REPORT_PACKAGE.name) private reportClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(reportClient);
  }

  onModuleInit(): any {
    this.reportService = this.reportClient.getService<IReportServiceClient>(
      this.configService.get('packageNames').REPORT_PACKAGE.packageName,
    );
  }
  async createReport(
    request: ICreateReportRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.getResponse<
      ICommonIsSuccessResponse,
      IReportServiceClient,
      ICreateReportRequest
    >(this.reportService, 'createReport', request);
  }
  async getReports(
    request: IGetReportsRequest,
  ): Promise<IPaginatedArray<IReport>> {
    const result = await this.getResponse<
      IPaginatedArray<IReport>,
      IReportServiceClient,
      IGetReportsRequest
    >(this.reportService, 'getReports', request);
    return { ...result, data: result.data || [] };
  }
  async updateReport(
    request: IUpdateReportRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.getResponse<
      ICommonIsSuccessResponse,
      IReportServiceClient,
      IUpdateReportRequest
    >(this.reportService, 'updateReport', request);
  }
  async deleteReport(
    request: IDeleteReportRequest,
  ): Promise<ICommonIsSuccessResponse> {
    return await this.getResponse<
      ICommonIsSuccessResponse,
      IReportServiceClient,
      IDeleteReportRequest
    >(this.reportService, 'deleteReport', request);
  }
}
