import { ErrorOrResult } from "./types";

export interface ScriptTagsCache<T> {
  [key: string]: PromiseWithResolvers<T> | undefined;
}

const scriptsCache: ScriptTagsCache<HTMLScriptElement> = {};

const _loadScript = (src: string): PromiseWithResolvers<HTMLScriptElement> => {
  if (scriptsCache[src]) {
    return scriptsCache[src]!;
  }

  const deferred = Promise.withResolvers<HTMLScriptElement>();

  const doc = window.document;

  const script = doc.createElement("script");

  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", src);

  script.addEventListener("error", (err) => {
    scriptsCache[src] = undefined!;

    deferred.reject(err);
  });

  script.addEventListener("load", () => {
    deferred.resolve(script);
  });

  doc.head.appendChild(script);

  scriptsCache[src] = deferred;

  return deferred;
};

export const loadScript = async (src: string): Promise<ErrorOrResult<HTMLScriptElement>> => {
  try {
    const script = await (_loadScript as unknown as (str: string) => Promise<HTMLScriptElement>)(
      src,
    );
    return [null, script];
  } catch (err) {
    return [err as Error, null];
  }
};
