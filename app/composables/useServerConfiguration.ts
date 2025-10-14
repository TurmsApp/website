export interface AppInfo {
  name: string;
  url: string;
  favicon?: string;
  terms_of_service?: string;
  privacy_policy?: string;
  support?: string;
  version: number;
  invite_only?: boolean;
  background?: string;
}

export const normalizeUrl = (
  url: string,
): {
  protocol: "https:" | "http:";
  host: string;
} => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Add a default protocol.
    // It will be updated later.
    url = "http://" + url;
  }

  // Parse URL.
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol === "http:" && parsedUrl.hostname !== "localhost") {
    // Force HTTPS if not in local.
    // If HTTPS is not supported, it'll throw an error.
    return { protocol: "https:", host: parsedUrl.host };
  } else {
    return {
      protocol: parsedUrl.protocol as "https:" | "http:",
      host: parsedUrl.host,
    };
  }
};

export default async function (domain: string): Promise<AppInfo> {
  let { protocol, host } = normalizeUrl(domain);
  let url = `${protocol}//${host}`;

  try {
    const json = await fetch(`${url}/status.json`, {
      method: "get",
    }).then((res) => res.json());
    return json as AppInfo;
  } catch (error) {
    throw error;
  }
}
