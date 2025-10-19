import { Action } from "../action";
import { AppAbility } from "../casl-ability.factory/casl-ability.factory";
import { Article } from "src/dto/aricle.dto";
interface IPolicyHandler {
    handle(ability : AppAbility) : boolean
}
type PolicyHandlerCallback = (ability : AppAbility) => boolean
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback


export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Article);
  }
}