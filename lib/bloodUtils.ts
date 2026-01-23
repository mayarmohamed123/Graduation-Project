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
