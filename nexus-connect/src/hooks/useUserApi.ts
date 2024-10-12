import User, {
  NexusProfile,
  RegistrationSchema,
  UserDTO,
} from '@/interfaces/User';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '@/states/userState';
import { ConnectApi } from '@/utils/request';
import { BASE_URL } from '@/utils/constants';

export default function useUserApi() {
  const navigate = useNavigate();
  const setUserConnections = useUserState((state) => state.setUserConnections);
  const jwt = useUserState((state) => state.userJwt);

  async function login() {
    // TODO
  }

  async function register(profile: NexusProfile, password: string) {
    const { ok } = await ConnectApi.post<RegistrationSchema, User>(
      `${BASE_URL}/register`,
      {
        email: profile.email,
        nexusUsername: profile.name,
        nexusProfileUrl: profile.profile_url,
        password,
      }
    );

    if (ok) {
      navigate('/verify');
    }
  }

  async function getConnections() {
    const { data: following } = await ConnectApi.get<UserDTO[]>(
      `${BASE_URL}/users/following`,
      jwt
    );

    const { data: followers } = await ConnectApi.get<UserDTO[]>(
      `${BASE_URL}/users/following`,
      jwt
    );

    setUserConnections(following, followers);
  }

  async function follow(userId: string) {
    const { data, ok } = await ConnectApi.postNoBody<UserDTO>(
      `${BASE_URL}/users/follow/` + userId,
      jwt
    );

    if (ok) {
      setUserConnections(data.following, data.followers);
    }
  }

  async function unfollow(userId: string) {
    const { data, ok } = await ConnectApi.postNoBody<UserDTO>(
      `${BASE_URL}/users/unfollow/` + userId,
      jwt
    );

    if (ok) {
      setUserConnections(data.following, data.followers);
    }
  }

  return { login, register, getConnections, follow, unfollow };
}
