import { cn } from "../../utils/cn";

const primary = "var(--color-primary)";
const primaryDark = "var(--color-primary-dark)";
const primaryLight = "var(--color-primary-light)";

export default function Button({
    children,
    variant = "default",
    size = "default",
    className,
    ...props
}) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        ddefault: `bg-[${primary}] text-white hover:bg-[${primaryDark}]`,
        outline: `border border-gray-300 text-gray-700 hover:bg-[${primaryLight}]`,
        secondary: `bg-[${primaryLight}] text-gray-700 hover:bg-[${primary}] hover:text-white`,
        ghost: `bg-transparent text-gray-600 hover:bg-[${primaryLight}]`,
        destructive: "bg-red-500 text-white hover:bg-red-600",
        link: `text-[${primary}] underline-offset-4 hover:underline`,
    };

    const sizes = {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}