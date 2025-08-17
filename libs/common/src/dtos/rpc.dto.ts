export type RpcResponse<T = void> = {
  data: T | any;
  error?: { message: string; statusCode: number };
};
