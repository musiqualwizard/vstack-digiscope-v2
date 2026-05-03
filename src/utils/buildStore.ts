export type BuildStatus = "Idea" | "Planning" | "Building" | "Testing" | "Ready";

export type BuildItem = {
  id: number;
  name: string;
  type: string;
  status: BuildStatus;
  owner: string;
};

const STORAGE_KEY = "vstack_builds";

export const getBuilds = (): BuildItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveBuilds = (builds: BuildItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
};