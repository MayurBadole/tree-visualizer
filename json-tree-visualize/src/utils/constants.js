const SAMPLE_JSON = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipcode": "10001"
    },
    "isActive": true
  },
  "total": 1029.98
}`;

export const NODE_COLORS = {
  object: {
    bg: "#e3f2fd",
    border: "#1976d2",
  },
  array: {
    bg: "#e8f5e8",
    border: "#4caf50",
  },
  primitive: {
    bg: "#fff3e0",
    border: "#ff9800",
  },
  highlighted: {
    bg: "#fff9c4",
    border: "#fbc02d",
  },
};

export const LAYOUT_CONFIG = {
  horizontalSpacing: 220,
  verticalSpacing: 120,
  initialX: 400,
  initialY: 60,
};

export default SAMPLE_JSON;
