// proteger-rota.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const ProtegerRota = () => SetMetadata('protegerRota', true);
