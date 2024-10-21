import { ClientRequestResolver, MethodNotAllowedError, RoutesConfig } from '../packages/httpServer';
import { createUserWithDb } from './api/create-user';
import { deleteUserWithDb } from './api/delete-user';
import { getUserWithDb } from './api/get-user';
import { getUsersWithDb } from './api/get-users';
import { updateUserWithDb } from './api/update-user';

export const usingUsersServiceRoutes = (DBHostname: string): RoutesConfig => {
  const processUsersApi: ClientRequestResolver = async (ctx) => {
    switch (ctx.req.method) {
      case 'GET':
        return ctx.req.url === '/api/users' ? getUsersWithDb(DBHostname)(ctx) : getUserWithDb(DBHostname)(ctx);
      case 'POST':
        return createUserWithDb(DBHostname)(ctx);
      case 'PUT':
        return updateUserWithDb(DBHostname)(ctx);
      case 'DELETE':
        return deleteUserWithDb(DBHostname)(ctx);
      default:
        MethodNotAllowedError.throw();
    }
  };

  return {
    '/api/users': processUsersApi,
    '/api/users/:userId': processUsersApi,
  };
};
