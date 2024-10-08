export interface UserBase {
  id: string;
  nexusUsername: string;
  nexusProfileUrl: string;
}

export default interface User extends UserBase {
  email: string;
}

export interface RegistrationSchema {
  email: string;
  nexusUsername: string;
  nexusProfileUrl: string;
  password: string;
}

export interface LoginSchema {
  email: string;
  password: string;
}

export interface UserDTO extends User {
  roles: string[];
  following: UserBase[];
  followers: UserBase[];
}

export interface NexusProfile {
  name: string;
  profile_url: string;
  email: string;
}
