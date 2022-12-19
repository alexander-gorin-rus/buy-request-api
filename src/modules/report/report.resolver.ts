import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { Report } from './models/report.model';
import { UseGuards } from '@nestjs/common';
import { UnregisteredUserGuard } from '../../common/guards/unregistered-user-guard/unregistered-user-guard';
import { CreateReportInput } from './dto/input/create-report.input';
import { UpdateReportInput } from './dto/input/update-report.input';
import { IsSuccessResponse } from '../../common/models';

@Resolver(() => Report)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async createReport(
    @Args('createReportData') createReportData: CreateReportInput,
  ) {
    return await this.reportService.createReport({
      report: createReportData,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async deleteReport(@Args('id') id: string) {
    return await this.reportService.deleteReport({
      id,
    });
  }

  @UseGuards(UnregisteredUserGuard)
  @Mutation(() => IsSuccessResponse)
  async updateReport(
    @Args('updateReportData') updateReportData: UpdateReportInput,
  ) {
    return await this.reportService.updateReport({
      report: updateReportData,
    });
  }
}
