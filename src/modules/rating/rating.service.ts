import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import configuration from '../../config/configuration';
import {
  GetRatingsRequest,
  ICreateRatingRequest,
  ICreateRatingResponse,
  IFeedbackServiceClient,
  IGetUserRatingResponse,
  IRating,
} from './interfaces/rating.interface';
import { DataArray } from '../../common/types';

const {
  packageNames: { FEEDBACK_PACKAGE },
} = configuration();

@Injectable()
export class RatingService extends GrpcRequestService implements OnModuleInit {
  private feedbackService: IFeedbackServiceClient;

  constructor(
    @Inject(FEEDBACK_PACKAGE.name) private feedbackClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(feedbackClient);
  }

  onModuleInit(): any {
    this.feedbackService =
      this.feedbackClient.getService<IFeedbackServiceClient>(
        this.configService.get('packageNames').FEEDBACK_PACKAGE.packageName,
      );
  }

  async createRating(
    rating: ICreateRatingRequest,
  ): Promise<ICreateRatingResponse> {
    return await this.getResponse<
      ICreateRatingResponse,
      IFeedbackServiceClient,
      any
    >(this.feedbackService, 'createRating', {
      rating,
    });
  }

  async getEntityRatings(entityId: string): Promise<DataArray<IRating>> {
    const result = await this.getResponse<
      DataArray<IRating>,
      IFeedbackServiceClient,
      GetRatingsRequest
    >(this.feedbackService, 'getEntityRatings', {
      entityId,
    });
    return { ...result, data: result.data || [] };
  }

  async getUserRatings(
    userId: string,
    page?: number,
    perPage?: number,
  ): Promise<IGetUserRatingResponse> {
    const result = await this.getResponse<
      IGetUserRatingResponse,
      IFeedbackServiceClient,
      GetRatingsRequest
    >(this.feedbackService, 'getUserRatings', {
      userId,
      page,
      perPage,
    });
    return { ...result, data: result.data || [] };
  }
}
