import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import i18n from "@/config/i18n";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import type { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";
import { es, enUS } from "react-day-picker/locale";

interface Props {
    label: string;
    placeholder: string,
    value: Date | undefined | string,
    onChange: (value: Date | undefined) => void,
    error: string | FieldError | Merge<FieldError, FieldErrorsImpl> | undefined | boolean;
}

export default function DatePicker({ label, placeholder, value, onChange, error }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Label className="mb-3">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="cursor-pointer ">
                        {value ? Intl.DateTimeFormat(i18n.language, {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric"
                        }).format(new Date(value)) : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar
                        disabled={{ before: new Date() }}
                        locale={i18n.language == "es" ? es : enUS}
                        mode="single"
                        selected={new Date(value || "")}
                        captionLayout="label"
                        onSelect={(date) => {
                            console.log(date);
                            onChange(date);
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
            {
                error && (
                    <p className="text-red-500 text-center">{
                        error.toString()
                    }</p>
                )
            }
        </div>
    );
}