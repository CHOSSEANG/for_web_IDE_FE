/**
 * Shared type definition for dashboard containers.
 * Currently mock data only; replace with backend response once API is available.
 */
export type ContainerItem = {
  id: string;
  name: string;
  tech: string;
  time: string;
  status: "running" | "stopped";
};
