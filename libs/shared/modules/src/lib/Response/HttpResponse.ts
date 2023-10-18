type DataResponseEntity<T> = {
  message?: string
  code?: number
  data?: object
} & T

type DtoHttpResponse<T> = {
  code: number
  message: string
} & Omit<DataResponseEntity<T>, 'message' | 'code'>

class HttpResponse {
  /**
   * Base Response
   * @param dataResponse
   * @returns
   */
  private static baseResponse<T>(
    dataResponse: DataResponseEntity<T>
  ): DtoHttpResponse<T> {
    const {
      message = 'Record has been retrieved',
      code = 200,
      ...rest
    } = dataResponse

    return { code, message, ...rest }
  }

  /**
   * Response Get or Sucess
   * @param dataResponse
   * @returns
   */
  public static get<T>(
    dataResponse: DataResponseEntity<T>
  ): DtoHttpResponse<T> {

    let message = "Record has been retrieved", code = 200;
    if (!dataResponse.data) {
      code = 404;
      message = "Records not found";
    }

    return this.baseResponse({ code, message, ...dataResponse })
  }

  /**
   * Response Created
   * @param dataResponse
   * @returns
   */
  public static created<T>(
    dataResponse: DataResponseEntity<T>
  ): DtoHttpResponse<T> {
    const message = "Record has been created successfully."

    return this.baseResponse({ code: 201, message, ...dataResponse })
  }

  /**
   * Response Updated
   * @param dataResponse
   * @returns
   */
  public static updated<T>(
    dataResponse: DataResponseEntity<T>
  ): DtoHttpResponse<T> {
    const message = "Record has been updated successfully."

    return this.baseResponse({ message, ...dataResponse })
  }

  /**
   * Response Deleted
   * @param dataResponse
   * @returns
   */
  public static deleted<T>(
    dataResponse: DataResponseEntity<T>
  ): DtoHttpResponse<T> {
    const message = "Record has been deleted successfully."

    return this.baseResponse({ message, ...dataResponse })
  }
}

export default HttpResponse
