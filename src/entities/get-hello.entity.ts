export class GetHelloEntity {
  /**
   * Users primary key
   * @example 1
   */
  readonly userId: number;

  /**
   * @example dhtjstlr777@gmail.com
   */
  readonly email: string;
  /**
   * @example "Hello world"
   */
  readonly message: string;
}
