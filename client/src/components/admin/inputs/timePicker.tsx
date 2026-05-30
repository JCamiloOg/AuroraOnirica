import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import type { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

interface Props {
    label: string;
    defaultValue?: string,
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl> | undefined | boolean;

}
export default function TimePicker({ label, defaultValue, error, ...rest }: Props) {
    return (
        <div>
            <Label className="mb-3">{label}</Label>
            <Input
                type="time"
                step="1"
                defaultValue={defaultValue}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                {...rest}
            />
            {
                error && (
                    <p className="text-red-500">{error.toString()}</p>
                )
            }
        </div>
    );
}