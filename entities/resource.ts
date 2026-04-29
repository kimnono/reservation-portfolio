export type ResourceType = "MEETING_ROOM" | "SEAT" | "DEVICE";

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  capacity?: number;
  enabled: boolean;
  amenities: string[];
};
