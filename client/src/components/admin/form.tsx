import logo from "@/assets/logoAurora.png";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import FormLoginInput from "./inputs/formLoginInput";
import { useForm } from "react-hook-form";
import type { Login } from "@/types/users";
import { login } from "@/services/userServices";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { ApiError } from "@/types/apiError";
import { useState } from "react";
import i18n from "@/config/i18n";
import { Button } from "../ui/button";
import toggleLang from "@/hooks/useToggleLanguage";

export default function FormLogin() {
    const { register, handleSubmit, formState: { errors } } = useForm<Login>();
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const { t } = useTranslation("translation", {
        keyPrefix: "admin.login"
    });


    const onSubmit = async (data: Login) => {
        try {
            setDisabled(true);
            const response = await login(data);

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(response.data?.redirect || "/admin/login");
            }
        } catch (error) {
            if (isAxiosError<ApiError>(error)) {
                toast.error(error.response?.data?.message || "Error inesperado, intente de nuevo.");
            } else {
                toast.error("Error inesperado, intente de nuevo.");
            }
        } finally {
            setTimeout(() => setDisabled(false), 1000);
        }
    };

    return (
        <div className="inline-flex items-center justify-center p-4 bg-transparent h-full w-full sm:w-auto">
            <div className="h-full w-full sm:min-w-[460px]">
                <div className="bg-black/40 backdrop-blur-3xl lg:max-w-[480px] z-10 p-6 relative w-full h-full border-t-4 border-blue-600 rounded-lg">
                    <div className="flex flex-col h-full gap-4">
                        <div className="mb-8 text-center ">
                            <NavLink to="/" className="flex justify-center  ">
                                <img src={logo} alt="logo" className="h-40" />
                            </NavLink>
                        </div>
                        <div className="my-auto">
                            <h4 className="text-white text-2xl font-semibold mb-2">{t("title")}</h4>
                            <p className="text-gray-100 mb-9">{t("subtitle")}</p>
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-4">
                                    <FormLoginInput
                                        error={errors.username?.message}
                                        label={t("form.username")}
                                        placeholder={t("form.usernamePlaceholder")}
                                        type="text"
                                        {...register("username", {
                                            required: t("form.errors.username.required"),
                                            maxLength: {
                                                value: 15,
                                                message: t("form.errors.username.maxLength")
                                            },
                                            minLength: {
                                                value: 5,
                                                message: t("form.errors.username.minLength")
                                            }
                                        })} />
                                </div>
                                <div className="mb-4">
                                    <FormLoginInput
                                        error={errors.password?.message}
                                        label={t("form.password")}
                                        placeholder={t("form.passwordPlaceholder")}
                                        type="password"
                                        {...register("password", {
                                            required: t("form.errors.password.required"),
                                            maxLength: {
                                                value: 15,
                                                message: t("form.errors.password.maxLength")
                                            },
                                            minLength: {
                                                value: 5,
                                                message: t("form.errors.password.minLength")
                                            }
                                        })} />
                                </div>
                                <div className="mb-6 text-center">
                                    <button
                                        className="w-full inline-flex items-center justify-center px-6 py-2 backdrop-blur-2xl bg-white/20 text-white rounded-lg transition-all duration-500 group hover:bg-blue-600/60 hover:text-white mt-5 cursor-pointer disabled:bg-white/10 disabled:text-white/50"
                                        type="submit"
                                        disabled={disabled || Object.keys(errors).length > 0}
                                    >
                                        {t("form.submit")}
                                    </button>
                                    <Button className="mt-10 w-50 bg-[#163ca3] hover:bg-[#163ca3]/50 cursor-pointer" type="button" onClick={toggleLang}>
                                        {i18n.language.toLocaleUpperCase()}
                                    </Button>
                                    <Button className="mt-10 w-full bg-[#163ca3] hover:bg-[#163ca3]/50 cursor-pointer" type="button" onClick={() => navigate("/")}>
                                        {
                                            i18n.language == "es" ? "Ir al inicio" : "Go to home"
                                        }
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}