import { TextareaHTMLAttributes } from 'react';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextAreaField({ label, error, required, ...props }: TextAreaFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-wing-text mb-1.5">
        {label} {required && <span className="text-wing-danger">*</span>}
      </label>
      <textarea
        {...props}
        rows={props.rows || 3}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wing-primary/20 focus:border-wing-primary transition-colors resize-none ${
          error ? 'border-wing-danger' : 'border-wing-border'
        } ${props.className || ''}`}
      />
      {error && <p className="mt-1 text-sm text-wing-danger">{error}</p>}
    </div>
  );
}
