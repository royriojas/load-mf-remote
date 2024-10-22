export type RemoteURI = `http://${string}` | `https://${string}`;
export type RemoteURL = `${string}@${RemoteURI}`;
export type ErrorOrResult<T> = [Error, null] | [null, T];

export type WebpackContainer = {
  init: (sharedScope: string) => Promise<void>;
  get: (moduleName: string) => Promise<() => unknown>;
};

export type GetModule = <T>(name: string) => Promise<T>;
