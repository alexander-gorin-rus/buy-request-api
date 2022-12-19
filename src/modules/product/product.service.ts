import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcRequestService } from '../../common/services/grpc.request.service';
import configuration from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import {
  ICommonIsSucessResponse,
  ICreateProductRequest,
  IDeleteProductRequest,
  IGetProductsForOfferRequest,
  IGetProductsRequest,
  IProduct,
  IProductServiceClient,
  IUpdateProductRequest,
} from './interface/product.interface';
import { IPaginatedArray } from '../../common/types';

const {
  packageNames: { PRODUCT_PACKAGE },
} = configuration();

@Injectable()
export class ProductService extends GrpcRequestService implements OnModuleInit {
  private productService: IProductServiceClient;

  constructor(
    @Inject(PRODUCT_PACKAGE.name) private productClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(productClient);
  }

  onModuleInit(): any {
    this.productService = this.productClient.getService<IProductServiceClient>(
      this.configService.get('packageNames').PRODUCT_PACKAGE.packageName,
    );
  }
  async createProduct(
    request: ICreateProductRequest,
  ): Promise<ICommonIsSucessResponse> {
    return await this.getResponse<
      ICommonIsSucessResponse,
      IProductServiceClient,
      ICreateProductRequest
    >(this.productService, 'createProduct', request);
  }
  async getProducts(
    request: IGetProductsRequest,
  ): Promise<IPaginatedArray<IProduct>> {
    const result = await this.getResponse<
      IPaginatedArray<IProduct>,
      IProductServiceClient,
      IGetProductsRequest
    >(this.productService, 'getProducts', request);
    return { ...result, data: result.data || [] };
  }

  async getProductsForOffer(
    request: IGetProductsForOfferRequest,
  ): Promise<IPaginatedArray<IProduct>> {
    const result = await this.getResponse<
      IPaginatedArray<IProduct>,
      IProductServiceClient,
      IGetProductsForOfferRequest
    >(this.productService, 'getProductsForOffer', request);
    return { ...result, data: result.data || [] };
  }

  async updateProduct(
    request: IUpdateProductRequest,
  ): Promise<ICommonIsSucessResponse> {
    return await this.getResponse<
      ICommonIsSucessResponse,
      IProductServiceClient,
      IUpdateProductRequest
    >(this.productService, 'updateProduct', request);
  }
  async deleteProduct(
    request: IDeleteProductRequest,
  ): Promise<ICommonIsSucessResponse> {
    return await this.getResponse<
      ICommonIsSucessResponse,
      IProductServiceClient,
      IDeleteProductRequest
    >(this.productService, 'deleteProduct', request);
  }
}
