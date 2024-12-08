// src/components/forms/BasicInfo.tsx
interface BasicInfoProps {
    formData: {
      name: string;
      installationDate: string;
      comments: string;
      status: 'draft' | 'saved';
    };
    updateField: (field: string, value: string) => void;
  }

  export default function BasicInfo({ formData, updateField }: BasicInfoProps) {
    return (
      <div className="space-y-6 p-6">
        <div className="relative">
          <label className="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-700">
              Name
          </label>
          <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter name"
          />
        </div>
  
        <div className="relative">
          <label className="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-700">
              Installation Date
          </label>
          <input
            type="date"
            value={formData.installationDate}
            onChange={(e) => updateField('installationDate', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder=" "
          />
        </div>
  
        <div className="relative">
          <label className="absolute -top-2.5 left-4 bg-white px-1 text-sm text-gray-700">
              Comments
          </label>
          <textarea
            value={formData.comments}
            onChange={(e) => updateField('comments', e.target.value)}
            className="w-full pt-6 pb-2 px-4 border rounded-lg peer focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32 resize-none"
            placeholder=" "
          />
        </div>
      </div>
    )
  }