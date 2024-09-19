import { NexusButton } from '@/components/NexusButton';
import { useUserState } from '@/states/userState';
import { fetch, Body } from '@tauri-apps/api/http';
import { NavLink, useNavigate } from 'react-router-dom';
import User, { UserDTO } from '@/interfaces/User';
import { useState } from 'react';
import { extractFromUserDTO } from '@/utils/mapping';

export default function Login() {
  const navigate = useNavigate();
  const saveUser = useUserState((state) => state.saveUser);
  const saveJwt = useUserState((state) => state.saveJwt);
  const setUserConnections = useUserState((state) => state.setUserConnections);
  const userJwt = useUserState((state) => state.userJwt);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // if (userJwt) {
  //   return (
  //     <div>
  //       <p>Signed in! {userJwt}</p>
  //     </div>
  //   );
  // }

  async function login() {
    const { data, headers } = await fetch<UserDTO>(
      'http://127.0.0.1:8000/login',
      {
        method: 'POST',
        body: Body.json({
          email,
          password,
        }),
      }
    );

    const [user, following, followers] = extractFromUserDTO(data);

    saveUser(user);
    setUserConnections(following, followers);

    const jwt = headers.authorization.split(' ')[1];

    saveJwt(jwt);

    navigate('/');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Login</h1>
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Email"
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Password"
          className="bg-gray-700 outline-none rounded-md mt-10 text-lg px-4 py-2"
        />
        <NexusButton onClick={login}>Login</NexusButton>
      </div>
      <NavLink to="/register" className="text-blue underline text-center mt-16">
        Create an account
      </NavLink>
    </div>
  );
}
