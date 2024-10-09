import { fetch } from '@tauri-apps/plugin-http';

interface ApiResponse<T> {
  data: T;
  ok: boolean;
  jwt?: string;
}

export class ConnectApi {
  static async get<T>(
    url: string,
    jwt: string,
    queries?: Record<string, string | undefined>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrlWithQueries(url, queries), {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + jwt,
      },
    });

    const data = await response.json();

    return { ok: response.ok, data };
  }

  static async post<BodyT, ReturnT>(
    url: string,
    body: BodyT,
    jwt?: string
  ): Promise<ApiResponse<ReturnT>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: jwt
        ? {
            authorization: 'Bearer ' + jwt,
          }
        : undefined,
      body: JSON.stringify(body),
    });

    const headerMap = new Map(response.headers.entries());
    let jwtResponse: string | undefined;

    if (headerMap.has('authorization')) {
      jwtResponse = headerMap.get('authorization')?.split(' ')[1];
    }

    const data = await response.json();

    return { ok: response.ok, data, jwt: jwtResponse };
  }

  static async postNoBody<ReturnT>(
    url: string,
    jwt?: string
  ): Promise<ApiResponse<ReturnT>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: jwt
        ? {
            authorization: 'Bearer ' + jwt,
          }
        : undefined,
    });

    const data = await response.json();

    return { ok: response.ok, data };
  }
}

export class NexusApi {
  static async get<T>(url: string, apikey: string): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey,
      },
    });

    const data = await response.json();

    return { ok: response.ok, data };
  }
}

function buildUrlWithQueries(
  url: string,
  queries?: Record<string, string | undefined>
): string {
  if (!queries) {
    return url;
  }

  let result = url + '?';

  for (const [name, value] of Object.entries(queries)) {
    if (!value) {
      continue;
    }

    if (result[result.length - 1] !== '?') {
      result += '&';
    }

    result += name + '=' + value;
  }

  return result;
}
