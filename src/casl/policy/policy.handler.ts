/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppAbility } from '../casl-ability.factory/casl-ability.factory';
interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
  getErrorMessage(): string;
}
type PolicyHandlerCallback = (ability: AppAbility) => boolean;
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export class WorkSpherPolicyHandler implements IPolicyHandler {
  constructor(
    private readonly action: any,
    private readonly subject: any,
    private readonly id?: any,
  ) {}
  handle(ability: AppAbility) {
    return ability.can(this.action, this.subject);
  }

  getErrorMessage(): string {
    return `You don't have permission to ${this.action} ${this.subject.name?.toLowerCase?.() || 'this resource'}`;
  }
}
