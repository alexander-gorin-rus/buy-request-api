export interface GrpcRequestInterface {
  getResponse<R, C, M>(client: C, grpcFunction: string, message: M): Promise<R>;
}
