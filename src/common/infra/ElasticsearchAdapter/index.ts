import { Client } from "@elastic/elasticsearch";

export const creatESAdapter = (
  ops: { host: string } = { host: "http://localhost:9200" }
): Client => {
  const client = new Client({ node: ops.host });

  // TODO: improve by abstract with own implement adapter model.
  return client;
};
