import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { User } from "./user.type";

@ValidatorConstraint({ async: true })
export class DoesEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(email: string): Promise<boolean> {
    const userEmails = [{ email: "test@testEmail.com" }];
    const itMatches = userEmails.filter((userEmail) => userEmail.email === email);
    if (itMatches.length > 0) {
      // If an email is found you can't use it to register.
      return new Promise((resolve) => resolve(false));
    } else {
      // If an email is NOT found it's available!
      return new Promise((resolve) => resolve(true));
    }
    // Future zapatos request
    // find a user in our database by matching
    // the provided email
    // If a user is found, return true.
    // otherwise return false.
    // return getRepository(User)
    //   .findOne({ where: { email } })
    //   .then((user) => {
    //     if (user) return false;
    //     return true;
    //   });
  }
}

export function DoesEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DoesEmailAlreadyExistConstraint,
    });
  };
}
