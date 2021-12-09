import Strategy from 'passport-google-id-token';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Provider, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserPayload } from 'src/user';

export enum GoogleTokenStrategyType {
  default = 'DEFAULT',
  web = 'WEB',
  iOS = 'IOS',
  android = 'ANDROID',
}

export interface IGoogleTokenStrategyConstruct {
  new (
    configService: ConfigService,
    authService: AuthService,
  ): IGoogleTokenStrategy;
}

export interface IGoogleTokenStrategy {
  validate(parsedToken, googleId): Promise<UserPayload>;
}

export const generateGoogleIdTokenStrategyName = (
  strategyType: GoogleTokenStrategyType,
) => `google-id-token-${strategyType}`;

const generateGoogleTokenStrategy = (
  strategyType: GoogleTokenStrategyType,
): IGoogleTokenStrategyConstruct => {
  const strategyName = generateGoogleIdTokenStrategyName(strategyType);

  @Injectable()
  class GoogleTokenStrategy
    extends PassportStrategy(Strategy, strategyName)
    implements IGoogleTokenStrategy {
    constructor(
      configService: ConfigService,
      private authService: AuthService,
    ) {
      super({
        clientID: configService.get<string>(`GOOGLE.CLIENT_ID.${strategyName}`),
      });
    }

    async validate(parsedToken, googleId) {
      const { name } = parsedToken;
      const user = await this.authService.validateUser(
        'google',
        googleId,
        name,
      );
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
  }

  return GoogleTokenStrategy;
};

const generateGoolgeTokenProvider = (
  strategyType: GoogleTokenStrategyType,
): Provider => ({
  provide: generateGoogleIdTokenStrategyName(strategyType),
  useClass: generateGoogleTokenStrategy(strategyType),
});

export const GoogleDefaultTokenProvider = generateGoolgeTokenProvider(
  GoogleTokenStrategyType.default,
);
export const GoogleWebTokenProvider = generateGoolgeTokenProvider(
  GoogleTokenStrategyType.web,
);
export const GoogleIOSTokenProvider = generateGoolgeTokenProvider(
  GoogleTokenStrategyType.iOS,
);
export const GoogleAndroidTokenProvider = generateGoolgeTokenProvider(
  GoogleTokenStrategyType.android,
);
