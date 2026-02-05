import type { UserService } from "@services/user.service";
import type { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await this.userService.getAllUsers();
      return reply.code(200).send(users);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ message: "Internal Server Error" });
    }
  };
}
