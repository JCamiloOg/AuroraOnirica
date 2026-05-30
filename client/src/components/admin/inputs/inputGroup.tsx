import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { InputHTMLAttributes } from "react";
import type { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    defaultValue?: string;
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl> | undefined | boolean;
    id: HTMLInputElement["id"];
}

export default function InputGroupPer({ label, defaultValue, error, id, ...rest }: Props) {
    return (
        <>
            <InputGroup>
                <InputGroupInput id={id} defaultValue={defaultValue} aria-invalid={error ? "true" : "false"} className={error ? "text-red-500" : ""} {...rest} />
                <InputGroupAddon align="block-start">
                    <Label htmlFor={id} className={error ? "text-red-500/80" : ""}>{label}</Label>
                    <FontAwesomeIcon className={error ? "text-red-500" : "text-green-500"} icon={error ? faX : faCheck} />
                </InputGroupAddon>
            </InputGroup>
            {
                error && (
                    <p className="text-red-500 my-1 wrap-break-word whitespace-normal">{error.toString()}</p>
                )
            }
        </>
    );
}