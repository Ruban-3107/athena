export const responseCF = (body: any) => {
  return !body
    ? {
        body: null,
      }
    : {
        body: body,
      };
};

export const bodyCF = ({
  val,
  message,
  code,
  status,
}: {
  val?: any;
  message?: any;
  code?: any;
  status?: string;
}): any => {
  return {
    code: !code ? null : code,
    value: !val ? null : val,
    status: !status ? null : status,
    message: !message ? null : message,
  };
};

export const codeValue = {
  success: 600,
  error: 611,
};
