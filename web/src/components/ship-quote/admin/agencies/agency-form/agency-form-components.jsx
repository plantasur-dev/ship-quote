
import { CircleAlert } from "lucide-react";

export function SectionHeading({ eyebrow, title }) {
    return (
        <div className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{ eyebrow }</p>
            <h2 className="mt-0.5 font-display text-sm font-semibold text-text-primary">{ title }</h2>
        </div>
    );
}

export function FieldLabel({ children, required }) {
    return (
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-text-muted">
            { children }
            { required && <span className="text-danger"> *</span> }
        </label>
    );
}

export function FieldError({ size = 15, message }) {
    return (
        <div className="mt-1 ml-3 text-sm text-danger"> 
            <div className='flex items-center gap-1'> <CircleAlert size={ size } /> { message } </div>
        </div>
    );
}

function Toggle({ checked, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={ checked }
            onClick={() => onChange(!checked)}
            disabled={ disabled }
            className={`
                relative 
                h-6 
                w-11 
                shrink-0 
                rounded-full 
                border 
                transition-colors 
                disabled:opacity-50 
                cursor-pointer
                ${ checked ? 'border-accent bg-accent' : 'border-panel-border bg-info-soft' }`
            }
        >
            <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-canvas transition-transform
                    ${ checked ? 'translate-x-[-18px]' : 'translate-x-0.5' }`}
            />
        </button>
    );
}

function ToggleRow({ label, hint, checked, onChange, disabled }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5">
            <div>
                <p className="text-sm text-text-primary">{ label }</p>
                { hint && <p className="mt-0.5 text-xs text-text-muted">{ hint }</p>}
            </div>
            <Toggle checked={ checked } onChange={ onChange } disabled={ disabled } />
        </div>
    );
}

export function FormToggleRow({ controller, name, control, ...props }) {
    
    const Controller = controller;

    return (
        <Controller
            name={ name }
            control={ control }
            render={({ field }) => (
                <ToggleRow
                    { ...props }
                    checked={ field.value }
                    onChange={ field.onChange }
                />
            )}
        />
    );
}