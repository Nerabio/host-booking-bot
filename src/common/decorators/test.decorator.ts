import { createParamDecorator } from "@nestjs/common";

export const TestDecorator = createParamDecorator((data, req) => {
  console.log(data);
  console.log(req);

  return req;
});
