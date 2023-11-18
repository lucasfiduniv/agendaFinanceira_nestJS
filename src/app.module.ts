import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres', // Este é o nome do serviço do PostgreSQL no seu docker-compose.yml
      port: 5432,
      username: 'lucas',
      password: '258456',
      database: 'AgendaFinanceira',
      autoLoadEntities: true,
      synchronize: true, // Somente para ambiente de desenvolvimento, desativar em produção
    }),
    UserModule,
  ],
})
export class AppModule {}
