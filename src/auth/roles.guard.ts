import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { getJwt } from './jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authentication = request.headers.authorization;
    const jwt = getJwt(authentication);
    return validateRoles(jwt.payload.user_id, roles);
  }
}
function validateRoles(
  user_id: string,
  roles: string[],
): boolean | Promise<boolean> | Observable<boolean> {
  if (roles.includes('admin')) {
    const admins = process.env.ADMINS.split(',');
    console.log(`is admin: ${admins.includes(user_id)}`);
    return admins.includes(user_id);
  }
  return true;
}
