import { Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import {
  generateGoogleIdTokenStrategyName,
  GoogleTokenStrategyType,
} from './google.strategy';

export interface GoogleTokenAuthGuardConstruct {
  new (): IAuthGuard;
}

const generateGoogleTokenAuthGuard = (
  strategyType: GoogleTokenStrategyType,
): GoogleTokenAuthGuardConstruct => {
  const strategyName = generateGoogleIdTokenStrategyName(strategyType);

  @Injectable()
  class GoogleTokenAuthGuard extends AuthGuard(strategyName) {}

  return GoogleTokenAuthGuard;
};

export const GoogleDefaultTokenAuthGuard = generateGoogleTokenAuthGuard(
  GoogleTokenStrategyType.default,
);
export const GoogleWebTokenAuthGuard = generateGoogleTokenAuthGuard(
  GoogleTokenStrategyType.web,
);
export const GoogleIOSTokenAuthGuard = generateGoogleTokenAuthGuard(
  GoogleTokenStrategyType.iOS,
);
export const GoogleAndroidTokenAuthGuard = generateGoogleTokenAuthGuard(
  GoogleTokenStrategyType.android,
);
