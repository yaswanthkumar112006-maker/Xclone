import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center max-w-sm mx-auto">
      {icon && <div className="text-gray-500 mb-4">{icon}</div>}
      <h3 className="text-xl font-bold text-gray-100 mb-2">{title}</h3>
      <p className="text-twitter-textMuted text-sm mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
