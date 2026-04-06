import type { Resource } from "@/entities/resource/types";
import { mockResources } from "@/mocks/db/in-memory-db";

export function listResources() {
  return [...mockResources];
}

export function findResourceById(resourceId: string) {
  return mockResources.find((resource) => resource.id === resourceId) ?? null;
}

export function saveResource(
  payload: Omit<Resource, "id"> & { id?: string | null },
) {
  if (payload.id) {
    const target = mockResources.find((resource) => resource.id === payload.id);

    if (!target) {
      throw new Error("수정할 자원을 찾지 못했습니다.");
    }

    Object.assign(target, {
      ...payload,
      id: payload.id,
    });

    return target;
  }

  const nextResource: Resource = {
    ...payload,
    id: `resource-${Date.now()}`,
  };

  mockResources.unshift(nextResource);
  return nextResource;
}

export function toggleResourceEnabled(resourceId: string) {
  const target = findResourceById(resourceId);

  if (!target) {
    throw new Error("토글할 자원을 찾지 못했습니다.");
  }

  target.enabled = !target.enabled;
  return target;
}
