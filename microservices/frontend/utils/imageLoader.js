// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
/*
  * We connect to image-provider through the envoy proxy, straight from the browser, for this we need to know the current hostname and port.
  * During building and serverside rendering, these are undefined so we use some conditionals and default values.
  */
let hostname = "localhost";
let port = 8080;
let protocol = "http";

if (typeof window !== "undefined" && window.location) {
  hostname = window.location.hostname;
  port = window.location.port ? parseInt(window.location.port, 10) : (window.location.protocol === "https:" ? 443 : 80);
  protocol = window.location.protocol.slice(0, -1); // Remove trailing ':'
}

export default function imageLoader({ src, width, quality }) {
  // For the demo, always use the same hostname and port as the current request
  // This ensures images work correctly whether accessed via localhost or external IP
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname, port } = window.location;
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    return `${baseUrl}/${src}?w=${width}&q=${quality || 75}`;
  }
  
  // Fallback for server-side rendering
  return `/${src}?w=${width}&q=${quality || 75}`;
}
