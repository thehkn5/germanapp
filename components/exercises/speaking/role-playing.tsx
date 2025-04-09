import React from 'react';
import { ExerciseProps } from '../exercise-session';

type RolePlayingProps = ExerciseProps & {
  scenario: string;
  roles: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  prompts: Array<{
    roleId: string;
    text: string;
  }>;
};

export const RolePlaying: React.FC<RolePlayingProps> = ({
  scenario,
  roles,
  prompts,
  onComplete,
  onProgress
}) => {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = React.useState(0);
  const [userResponses, setUserResponses] = React.useState<Record<number, string>>({});

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    onProgress?.(0.3);
  };

  const handleResponseChange = (value: string) => {
    setUserResponses(prev => ({
      ...prev,
      [currentPromptIndex]: value
    }));
  };

  const handleNextPrompt = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      onProgress?.(0.3 + (0.7 * (currentPromptIndex + 1) / prompts.length));
    } else {
      onComplete?.();
      onProgress?.(1);
    }
  };

  const currentPrompt = prompts[currentPromptIndex];
  const isCurrentRole = selectedRole === currentPrompt.roleId;
  const currentResponse = userResponses[currentPromptIndex] || '';

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Scenario:</h2>
        <p className="text-sm">{scenario}</p>
      </div>

      {!selectedRole ? (
        <div className="space-y-4">
          <h3 className="font-medium">Select your role:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="border rounded p-3 text-left hover:bg-gray-50"
              >
                <h4 className="font-medium">{role.name}</h4>
                <p className="text-sm text-gray-600">{role.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">
              {isCurrentRole ? 'Your turn:' : `${roles.find(r => r.id === currentPrompt.roleId)?.name}'s turn:`}
            </h3>
            <p className="text-sm">{currentPrompt.text}</p>
          </div>

          {isCurrentRole && (
            <div className="space-y-2">
              <textarea
                className="border rounded p-2 w-full min-h-[100px]"
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder="Type your response here..."
              />
              <button
                onClick={handleNextPrompt}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!currentResponse}
              >
                {currentPromptIndex < prompts.length - 1 ? 'Next' : 'Complete'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};