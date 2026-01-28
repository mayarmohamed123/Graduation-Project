"use client";

import { useLocation } from "@/hooks/useLocation";

/**
 * Headless component to handle location side effects
 * in a Server Component page.
 */
export default function UserLocationManager() {
  useLocation();
  return null;
}
