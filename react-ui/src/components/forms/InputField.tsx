import { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export function InputField({ label, error, icon, required, ...props }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-wing-text mb-1.5">
        {label} {required && <span className="text-wing-danger">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wing-primary/20 focus:border-wing-primary transition-colors ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-wing-danger' : 'border-wing-border'} ${props.className || ''}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-wing-danger">{error}</p>}
    </div>
  );
}
