import type { Resource } from "@/entities/resource";
import {
  listResources,
  saveResource,
  toggleResourceEnabled,
} from "@/mocks/repositories/resource-repository";
import { mockDelay } from "@/common/lib/mock-delay";

export async function getResources() {
  await mockDelay();
  return listResources();
}

export async function upsertResource(
  payload: Omit<Resource, "id"> & { id?: string | null },
) {
  await mockDelay();
  return saveResource(payload);
}

export async function toggleResource(resourceId: string) {
  await mockDelay();
  return toggleResourceEnabled(resourceId);
}
