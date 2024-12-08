import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';

interface BasicInfoProps {
  formData: {
    name: string;
    installationDate: string;
    comments: string;
    status: 'draft' | 'saved';
  };
  updateField: (field: string, value: string) => void;
  hasError?: boolean;
}

const BasicInfo = forwardRef<{ validateName: () => boolean }, BasicInfoProps>(
  ({ formData, updateField, hasError }, ref) => {
    const [nameError, setNameError] = useState('');
    const [touched, setTouched] = useState(false);

    useEffect(() => {
      if (hasError) {
        validateName(formData.name);
        setTouched(true);
      }
    }, [hasError, formData.name]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateField('name', value);
      if (touched) {
        validateName(value);
      }
    };

    const validateName = (value: string) => {
      const isValid = value.trim() !== '';
      setNameError(isValid ? '' : 'Project name is required');
      return isValid;
    };

    const handleNameBlur = () => {
      setTouched(true);
      validateName(formData.name);
    };

    useImperativeHandle(ref, () => ({
      validateName: () => validateName(formData.name)
    }));

    return (
      <div className="space-y-6 p-6">
        <div className="relative">
          <label 
            htmlFor="projectName" 
            className="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-700 flex items-center gap-1"
          >
            Name
            <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            required
            aria-required="true"
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "nameError" : undefined}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              nameError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter name"
          />
          {nameError && (
            <p id="nameError" className="mt-1 text-sm text-red-500" role="alert">
              {nameError}
            </p>
          )}
        </div>

        <div className="relative">
          <label 
            htmlFor="installDate" 
            className="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-700"
          >
            Installation Date
          </label>
          <input
            id="installDate"
            type="date"
            value={formData.installationDate}
            onChange={(e) => updateField('installationDate', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder=" "
          />
        </div>

        <div className="relative">
          <label 
            htmlFor="comments" 
            className="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-700"
          >
            Comments
          </label>
          <textarea
            id="comments"
            value={formData.comments}
            onChange={(e) => updateField('comments', e.target.value)}
            className="w-full pt-6 pb-2 px-4 border rounded-lg peer focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32 resize-none"
            placeholder=" "
          />
        </div>
      </div>
    );
  }
);

BasicInfo.displayName = 'BasicInfo';

export default BasicInfo;