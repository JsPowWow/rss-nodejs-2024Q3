import { serve } from './serialization.ts';
import { DbServerRequest, DbServerResponse } from './types.ts';
import { UsersService } from './UsersService.ts';

export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly options?: { withRoutes?: Record<string, unknown> },
  ) {}

  routing = {
    ...(this.options?.withRoutes && this.options.withRoutes),
    '/api/users': async (
      req: DbServerRequest,
      res: DbServerResponse,
      callback: (data: unknown) => void,
    ) => {
      const users = await this.getUsers();
      console.log(req.url + ' ' + res.statusCode);
      callback({ status: res.statusCode, users });
    },
  };

  public processRequest = (req: DbServerRequest, res: DbServerResponse) => {
    serve(this.routing[<keyof typeof this.routing>req.url], req, res);
  };

  getUsers = async () => this.service.getAll();
}
