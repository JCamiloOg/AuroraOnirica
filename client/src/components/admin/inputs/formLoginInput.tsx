import type { HTMLInputTypeAttribute } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";


interface Props {
    label: string;
    placeholder: HTMLInputElement["placeholder"];
    type: HTMLInputTypeAttribute;
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl> | undefined;
}

export default function FormLoginInput({ label, placeholder, type, error, ...rest }: Props) {

    const baseClassLabel = " text-gray-200 mb-2";
    const errorClassLabel = "text-red-500 mb-2";

    const baseClassInput = "ring-white/50 text-white/80 focus:ring-white";
    const errorClassInput = "ring-red-500/50 text-red-500 focus:ring-red-500";

    return (
        <>
            <label className={`block text-base/normal font-semibold ${error ? errorClassLabel : baseClassLabel}`}>
                {label}
            </label >
            <input
                className={`block w-full rounded py-1.5 px-3 bg-transparent outline-0 ring-1 ${error ? errorClassInput : baseClassInput}`}
                type={type}
                autoComplete="off"
                placeholder={placeholder}
                {...rest}
            />
            {
                error && (
                    <p className="text-red-500 my-3 wrap-break-word whitespace-normal">{error.toString()}</p>
                )
            }
        </>
    );
}