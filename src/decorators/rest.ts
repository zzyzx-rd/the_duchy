import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_PATH } from '@const/auth';

export const SkipAuth = () => SetMetadata(IS_PUBLIC_PATH, true);
