export const formatBloodType = (type: string | undefined): string => {
  if (!type) return "";

  const map: Record<string, string> = {
    aneg: "A-",
    apos: "A+",
    bpos: "B+",
    bneg: "B-",
    abpos: "AB+",
    abneg: "AB-",
    opos: "O+",
    oneg: "O-",
  };

  return map[type.toLowerCase()] || type.toUpperCase();
};

// Blood type string to enum mapping
// Based on common blood type enum patterns (adjust if your backend uses different values)
export const bloodTypeToEnum = (bloodType: string): number => {
  const typeMap: Record<string, number> = {
    apos: 0,
    aneg: 1,
    bpos: 2,
    bneg: 3,
    abpos: 4,
    abneg: 5,
    opos: 6,
    oneg: 7,
  };

  const normalized = bloodType.toLowerCase().replace(/[^a-z]/g, "");
  return typeMap[normalized] ?? 0;
};

// Enum to blood type string (for display)
export const enumToBloodType = (enumValue: number): string => {
  const typeMap: Record<number, string> = {
    0: "A+",
    1: "A-",
    2: "B+",
    3: "B-",
    4: "AB+",
    5: "AB-",
    6: "O+",
    7: "O-",
  };

  return typeMap[enumValue] ?? "Unknown";
};
