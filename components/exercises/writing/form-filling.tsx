import React from 'react';
import { ExerciseProps } from '../exercise-session';

type FormFillingProps = ExerciseProps & {
  formTitle: string;
  fields: Array<{
    label: string;
    type: 'text' | 'date' | 'email' | 'number' | 'select';
    required?: boolean;
    options?: string[];
  }>;
};

export const FormFilling: React.FC<FormFillingProps> = ({
  formTitle,
  fields,
  onComplete,
  onProgress
}) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (fieldLabel: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldLabel]: value }));
    
    // Calculate progress based on filled fields
    const filledFields = Object.keys(formData).length + (value ? 1 : 0);
    onProgress?.(filledFields / fields.length);
  };

  const handleSubmit = () => {
    setFeedback('Submitted!');
    onComplete?.();
  };

  const allRequiredFilled = fields.every(
    field => !field.required || formData[field.label]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{formTitle}</div>
      
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="space-y-1">
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                className="border rounded p-2 w-full"
                value={formData[field.label] || ''}
                onChange={(e) => handleChange(field.label, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options?.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className="border rounded p-2 w-full"
                value={formData[field.label] || ''}
                onChange={(e) => handleChange(field.label, e.target.value)}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!allRequiredFilled}
      >
        Submit
      </button>
    </div>
  );
};