import { loadModuleFederatedContainer } from "./load-mf-container";
import { ErrorOrResult, GetModule, RemoteURL } from "./types";

export const loadMFRemote = async (remoteURL: RemoteURL): Promise<ErrorOrResult<GetModule>> => {
  const [err, container] = await loadModuleFederatedContainer(remoteURL);
  if (err) {
    return [err, null];
  }

  const getModule = async <K>(component: string) => {
    component = `./${component}`;
    const factory = await container.get(component);
    if (!factory) throw new Error(`Cannot load ${component} in remoteURL: ${remoteURL}`);
    const Module = factory();
    return Module as K;
  };

  return [null, getModule];
};

export { loadScript } from "./load-script";
export type * from "./types";
export { withRetry } from "./with-retry";
