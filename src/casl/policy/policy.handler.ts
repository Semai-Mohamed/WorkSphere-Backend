import { Project } from "src/project/project.entity";
import { Action } from "../action";
import { AppAbility } from "../casl-ability.factory/casl-ability.factory";
interface IPolicyHandler {
    handle(ability : AppAbility) : boolean
}
type PolicyHandlerCallback = (ability : AppAbility) => boolean
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback


export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, Project);
  }
}