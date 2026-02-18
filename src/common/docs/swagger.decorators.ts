import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorDto } from './api-error.dto';

export const ApiBadRequest = () => ApiBadRequestResponse({ type: ApiErrorDto });
export const ApiUnauthorized = () =>
  ApiUnauthorizedResponse({ type: ApiErrorDto });
export const ApiNotFound = () => ApiNotFoundResponse({ type: ApiErrorDto });
export const ApiConflict = () => ApiConflictResponse({ type: ApiErrorDto });
