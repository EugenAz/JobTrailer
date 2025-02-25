import { Global, Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsResolver } from './applications.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity])],
  providers: [ApplicationsService, ApplicationsResolver],
  exports: [ApplicationsService, ApplicationsResolver],
})
export class ApplicationModule {}
