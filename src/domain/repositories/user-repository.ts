import { User } from "@domain";

export interface UserRepository {
  create(user: User): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
}
