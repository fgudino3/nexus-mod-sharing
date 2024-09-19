export interface UserBase {
  id: string;
  nexusUsername: string;
  nexusProfileUrl: string;
}

export default interface User extends UserBase {
  email: string;
}

export interface UserDTO extends User {
  roles: string[];
  following: UserBase[];
  followers: UserBase[];
}
