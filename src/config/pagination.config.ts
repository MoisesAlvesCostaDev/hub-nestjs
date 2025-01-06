import { ConfigService } from '@nestjs/config';

export const getDefaultPagination = (configService: ConfigService) => {
  const defaultPage = configService.get<number>('PAGINATION_DEFAULT_PAGE', 1);
  const defaultLimit = configService.get<number>(
    'PAGINATION_DEFAULT_LIMIT',
    10,
  );

  return { defaultPage, defaultLimit };
};
