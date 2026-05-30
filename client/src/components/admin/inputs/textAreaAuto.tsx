import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/components/ui/input-group";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@/components/ui/label";
import type { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

interface Props {
    label: string;
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl> | undefined | boolean;
    defaultValue?: string;
    id: HTMLTextAreaElement["id"];
}

export default function TextAreaAuto({ label, error, defaultValue, id, ...rest }: Props) {
    return (
        <>
            <InputGroup>
                <InputGroupTextarea id={id} aria-invalid={error ? "true" : "false"} className={`overflow-auto max-h-32 ${error ? "text-red-500" : ""}`} defaultValue={defaultValue} {...rest} />
                <InputGroupAddon className="flex justify-between" align="block-start">
                    <Label htmlFor={id} className={error ? "text-red-500/80" : ""}>{label}</Label>
                    <FontAwesomeIcon className={error ? "text-red-500" : "text-green-500"} icon={error ? faX : faCheck} />
                </InputGroupAddon>
            </InputGroup>
            {
                error && (
                    <p className="text-red-500 my-3 wrap-break-word whitespace-normal">{error.toString()}</p>
                )
            }
        </>
    );
}