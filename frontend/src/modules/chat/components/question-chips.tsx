import React from 'react';
import { Button } from '@/core/components/ui/button';

interface QuestionChipsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const QuestionChips: React.FC<QuestionChipsProps> = ({ questions, onSelect }) => {
  if (!questions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {questions.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs border-border text-foreground hover:bg-accent cursor-pointer"
          onClick={() => onSelect(question)}
        >
          {question}
        </Button>
      ))}
    </div>
  );
};

export default QuestionChips;
