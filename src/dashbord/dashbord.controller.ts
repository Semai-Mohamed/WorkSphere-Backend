import { Controller, Get, UseGuards } from '@nestjs/common';
import { PoliciesGuard } from 'src/casl/policy/policies.guard';
import { ReadArticlePolicyHandler } from 'src/casl/policy/policy.handler';
import { CheckPolicies } from 'src/casl/policy/policy.metadata';

@Controller('dashbord')
export class DashbordController {
    @Get()
    @UseGuards(PoliciesGuard)
    @CheckPolicies(new ReadArticlePolicyHandler)
    findAll(){
        return ""
    }
}
