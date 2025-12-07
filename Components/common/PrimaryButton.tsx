import React from "react";

interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    fullWidth?: boolean;
    variant?: "primary" | "outline" | "danger" | "secondary";
    size?: "sm" | "md" | "lg";
    className?: string;
}

/**
 * PrimaryButton - A reusable button component with multiple variants and sizes
 * 
 * @example
 * // Basic usage
 * <PrimaryButton>Click me</PrimaryButton>
 * 
 * @example
 * // With variant and size
 * <PrimaryButton variant="outline" size="lg" fullWidth>
 *   Submit
 * </PrimaryButton>
 * 
 * @example
 * // With onClick handler
 * <PrimaryButton onClick={() => console.log('clicked')} variant="danger">
 *   Delete
 * </PrimaryButton>
 */
export default function PrimaryButton({
    children,
    onClick,
    type = "button",
    disabled = false,
    fullWidth = false,
    variant = "primary",
    size = "md",
    className = "",
}: PrimaryButtonProps) {
    const baseStyles = "font-medium rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary/90",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        danger: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-white text-primary hover:bg-primary/10",
    };

    const sizeStyles = {
        sm: "py-2 px-3 text-sm",
        md: "py-3 px-4 text-base",
        lg: "py-4 px-6 text-lg",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        >
            {children}
        </button>
    );
}
