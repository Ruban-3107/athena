import handlebars from "handlebars";

export const generateMailContent = (templatePath, mailContentData) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const source = require(`./template/${templatePath}`);
    const template = handlebars.compile(source);
    return template(mailContentData);
};

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /^\d{10}$/;
  return regex.test(phoneNumber);
}