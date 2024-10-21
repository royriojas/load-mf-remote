import { loadScript } from "./load-script";
import { ErrorOrResult, RemoteURL, WebpackContainer } from "./types";

export interface RemoteContainerInfo {
  name: string;
  url: string;
}

const _loadModuleFederatedContainer = async (
  remote: RemoteContainerInfo,
  scope: string = "default",
): Promise<ErrorOrResult<WebpackContainer>> => {
  let container: WebpackContainer | null = null;

  const { name, url } = remote;

  try {
    const [err] = await loadScript(url);

    if (err) {
      return [err, null];
    }

    // Initializes the share scope. This fills it with
    // known provided modules from this remote script
    // @ts-expect-error this exists for modules loaded with webpack
    await __webpack_init_sharing__(scope);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    container = (await (window as any)[name]) as WebpackContainer;

    if (!container || !container.init) {
      throw new Error(`container in ${name} does not expose init method`);
    }

    // Initialize the container, it may provide shared modules
    // @ts-expect-error this exists for modules loaded with webpack
    await container.init(__webpack_share_scopes__[scope]);
  } catch (err) {
    const newERrr = new Error(
      `Fail to load container: ${name} from url: ${url}. ${(err as Error).message}`,
    );
    return [newERrr, null];
  }
  return [null, container];
};

export type ContainerCache = {
  [key: string]: Promise<ErrorOrResult<WebpackContainer>> | undefined;
};

const containerCache: ContainerCache = {};

export const loadModuleFederatedContainer = async (
  remoteDescriptor: RemoteURL,
): Promise<ErrorOrResult<WebpackContainer>> => {
  if (containerCache[remoteDescriptor]) {
    return containerCache[remoteDescriptor];
  }

  const [container, url] = remoteDescriptor.split("@");

  const res = _loadModuleFederatedContainer({ name: container, url });
  containerCache[remoteDescriptor] = res;
  res.then(([err]) => {
    if (err) {
      containerCache[remoteDescriptor] = undefined;
    }
  });
  return res;
};
