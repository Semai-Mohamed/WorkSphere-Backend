/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY_KEY = 'check_ability';
export const CheckPolicies = (action: string, subject: any,fieldName? : string) =>
  SetMetadata(CHECK_ABILITY_KEY, { action, subject ,fieldName});
