/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const CHECK_ABILITY_KEY = 'check_ability';

export interface PolicyMetadata {
  action: string;
  subject: any;
  fieldName?: string;
}

export const CheckPolicies = (
  action: string,
  subject: any,
  fieldName?: string,
) => {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    const metadataTarget: any = descriptor ? descriptor.value : target;

    const existingPolicies: PolicyMetadata[] =
      Reflect.getMetadata(CHECK_ABILITY_KEY, metadataTarget) || [];

    const newPolicies: PolicyMetadata[] = [
      ...existingPolicies,
      { action, subject, fieldName },
    ];

    Reflect.defineMetadata(CHECK_ABILITY_KEY, newPolicies, metadataTarget);
  };
};
