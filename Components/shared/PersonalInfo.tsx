"use client";

import { Button, Input, Label } from "../ui";
import { useState } from "react";
import type { UserProfileForm } from "@/types";

// Re-export for backward compatibility
export type UserState = UserProfileForm;

interface Props {
  user: UserState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void>;
}

export default function PersonalInfo({ user, onChange, onSave }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-8">
        Personal information
      </h2>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Username"
            name="username"
            value={user.username}
            onChange={onChange}
          />
          <FormField
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={onChange}
          />
          <FormField
            label="Email"
            type="email"
            name="email"
            value={user.email}
            onChange={onChange}
          />
          <FormField
            label="Address"
            name="address"
            value={user.address}
            onChange={onChange}
          />
        </div>

        <div className="flex gap-4 mt-8 justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary text-white px-8 py-3 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function FormField({ label, type = "text", ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-primary" htmlFor={props.name}>
        {label}
      </Label>
      <Input id={props.name} type={type} {...props} className="w-full" />
    </div>
  );
}
