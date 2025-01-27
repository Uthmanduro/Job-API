import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AuthGuard, AdminGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('application')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobId')
  @ApiParam({ name: 'jobId', type: String })
  create(
    @Req() request: Request,
    @Param('jobId') jobId,
    @Body() applicationData: CreateApplicationDto,
  ) {
    const id = request['user'].sub;
    return this.applicationService.createApplication(jobId, {
      ...applicationData,
      applicantId: id,
    });
  }

  @Get(':jobId')
  findOne(@Param('JobId') jobId: string) {
    return this.applicationService.findApplicationByJob(jobId);
  }

  @Patch(':applicationId')
  @UseGuards(AdminGuard)
  update(
    @Param('applicationId') applicationId: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(applicationId, updateApplicationDto);
  }

  @Delete(':applicationId')
  @UseGuards(AdminGuard)
  remove(@Param(':applicationId') applicationId: string) {
    return this.applicationService.remove(applicationId);
  }
}
