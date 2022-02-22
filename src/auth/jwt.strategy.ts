import { PassportStrategy } from '@nestjs/passport';
import fetch from 'cross-fetch';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { env } from 'process';
import { Request } from 'express';

let secrets: any;

export function getJwt(rawJwtToken: string) {
  rawJwtToken = rawJwtToken.replace('Bearer ', '');
  const splitToken = rawJwtToken.split('.');
  const rawHeaders = splitToken[0];
  const headerBuffer = Buffer.from(rawHeaders, 'base64');
  const headers = JSON.parse(headerBuffer.toString());
  const rawPayload = splitToken[1];
  const payloadBuffer = Buffer.from(rawPayload, 'base64');
  const payload = JSON.parse(payloadBuffer.toString());

  return {
    headers,
    payload,
  };
}

function keyProvider(request, rawJwtToken, done) {
  const jwt = getJwt(rawJwtToken);
  if (!secrets[jwt.headers.kid]) {
    done(true);
  }
  done(false, secrets[jwt.headers.kid]);
}
function extractor(request: Request): string | null {
  const paramToken = request.query;

  return request.headers.authorization;
}

function getNewSecrets() {
  fetch(env.JWT_SECRET_URL)
    .then((response) => response.json())
    .then((newSecrets) => (secrets = newSecrets));
}

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: keyProvider,
    });
    getNewSecrets();
  }

  async validate(payload: any) {
    return {};
  }
}
