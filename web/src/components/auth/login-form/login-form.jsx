
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, MessageCircleWarning, CircleAlert } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { NAV_ITEMS } from "../../../utils";

import { useAuth } from "../../../contexts/auth-context";

const validations = {
    emailUser: { 
        required: 'Email requerido',
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Introduce un email correcto'
        }
    },
    passwordUser: { 
        required: 'Password requerido',
        minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
        },
    }
}

function LoginForm() {

    const [serverError, setServerError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();

    const { 
        register, 
        handleSubmit,
        clearErrors,
        formState: { isSubmitting, isValid, errors } 
    } = useForm({ 
        mode: 'all', 
        reValidateMode: "onChange" 
    });

    const handleLogin = async (data) => {
        setServerError(null);
        clearErrors();

        try {
            await login(data.emailUser, data.passwordUser);
            navigate(NAV_ITEMS[0].to);
        } catch (error) {
            console.error(error);
            const { errors } = error;
            setServerError(errors?.message);
        }
    }

    return (
        <form onSubmit={ handleSubmit(handleLogin) } className="mt-7 space-y-4" noValidate>
            <div>
                <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-text-muted font-mono"
                >
                    Email
                </label>
                
                <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={ 16 } />

                    <input
                        id="emailUser"
                        type="email"
                        autoComplete="email"
                        placeholder="nombre@empresa.com"
                        className={`
                            field-input 
                            w-full 
                            rounded-xl 
                            py-2.5 
                            pl-10 
                            pr-3.5
                            text-sm 
                            text-text-primary 
                            transition-shadow 
                            bg-input-bg
                            border-2 
                            focus:ring-2
                            ${ errors.emailUser
                                ? "border-red-600 focus:ring-red-600"
                                : "border-panel-border focus:ring-panel-border"
                            }
                        `}
                        {...register('emailUser', { 
                            ...validations.emailUser,
                            onChange: () => {
                                clearErrors();
                                setServerError(null);
                            }
                        })}
                    />
                </div>

                { errors.emailUser && (
                    <div className="mt-1 text-sm text-red-500">
                        <div className='flex items-center gap-1 ml-2 mt-2'> 
                            <CircleAlert size={ 16 } />
                            { errors.emailUser.message }
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className="mb-1.5 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="block text-[11px] font-medium uppercase tracking-wider text-text-muted font-mono">
                        Contraseña
                    </label>
                </div>
                
                <div className="relative">
                    <Lock
                        size={ 16 }
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                    />

                    <input
                        id="passwordUser"
                        type={ showPassword ? "text" : "password" }
                        autoComplete="current-password"                       
                        placeholder="••••••••"
                        className={`
                            field-input 
                            w-full 
                            rounded-xl 
                            py-2.5 
                            pl-10 
                            pr-10
                            text-sm 
                            text-text-primary 
                            transition-shadow 
                            bg-input-bg
                            border-2 
                            focus:ring-2
                            ${ errors.passwordUser
                                ? "border-red-600 focus:ring-red-600"
                                : "border-panel-border focus:ring-panel-border"
                            }
                        `}
                        {...register('passwordUser', {
                            ...validations.passwordUser,
                            onChange: () => {
                                clearErrors();
                                setServerError(null);
                            }
                        })}
                    />

                    <button
                        type="button"
                        onClick={ () => setShowPassword((show) => !show) }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted cursor-pointer"
                        aria-label={ showPassword ? "Ocultar contraseña" : "Mostrar contraseña" }
                    >
                        { showPassword ? <EyeOff size={ 16 } /> : <Eye size={ 16 } /> }
                    </button>
                </div>

                { errors.passwordUser && (
                    <div className="mt-1 text-sm text-red-500">
                        <div className='flex items-center gap-1 ml-2 mt-2'> 
                            <CircleAlert size={ 16 } />
                            { errors.passwordUser.message }
                        </div>
                    </div>
                ) }
            </div>

            { serverError && (
                <div
                    className="flex items-center justify-center gap-2 rounded-lg border border-danger px-3.5 py-2.5 text-sm text-center bg-danger-soft"
                    style={{ color: "#FCA5A5" }}
                    role="alert"
                >
                   <> 
                        <MessageCircleWarning 
                            size={ 16 }
                            absoluteStrokeWidth={ true }
                        /> 
                        { serverError }
                    </>
                </div>
            )}

            <button
                type="submit"
                disabled={ !isValid }
                className="
                    mt-2 
                    flex 
                    w-full 
                    items-center 
                    justify-center 
                    gap-2 
                    rounded-xl 
                    py-2.5 
                    text-sm 
                    text-canvas
                    font-semibold 
                    tracking-wide 
                    transition-opacity 
                    disabled:opacity-60
                    cursor-pointer
                    bg-accent
                "
            >
                { isSubmitting 
                    ? ( <Loader2 size={ 16 } className="animate-spin" /> ) 
                    : ( <> Entrar <ArrowRight size={ 16 } /> </> ) 
                }
            </button>
        </form>
    );
}

export default LoginForm;