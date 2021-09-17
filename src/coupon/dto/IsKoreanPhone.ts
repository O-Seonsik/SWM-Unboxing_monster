import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsKoreanPhone(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsKoreanPhone',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            /^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/.test(value)
          );
        },
      },
    });
  };
}
