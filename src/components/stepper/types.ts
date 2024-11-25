import React from 'react';

export type Step = {
  component: React.FC<any>;
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
};
