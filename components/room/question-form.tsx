"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface QuestionFormData {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  timeLimit: number;
}

interface QuestionFormProps {
  question: QuestionFormData;
  index: number;
  onChange: (question: QuestionFormData) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const TIME_LIMITS = [10, 15, 20, 30];

export function QuestionForm({
  question,
  index,
  onChange,
  onRemove,
  canRemove,
}: QuestionFormProps) {
  const labels = ["A", "B", "C", "D"];

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options] as [string, string, string, string];
    newOptions[optionIndex] = value;
    onChange({ ...question, options: newOptions });
  };

  const handleCorrectChange = (optionIndex: number) => {
    onChange({ ...question, correctOptionIndex: optionIndex });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Question {index + 1}
            </CardTitle>
            {canRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Question Text
            </label>
            <Input
              placeholder="Enter your question..."
              value={question.text}
              onChange={(e) => onChange({ ...question, text: e.target.value })}
              className="font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Answer Options
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCorrectChange(optIndex)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                      question.correctOptionIndex === optIndex
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {labels[optIndex]}
                  </button>
                  <Input
                    placeholder={`Option ${labels[optIndex]}...`}
                    value={option}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    className={cn(
                      "flex-1",
                      question.correctOptionIndex === optIndex &&
                        "border-green-500 focus-visible:ring-green-500"
                    )}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Click the letter button to mark the correct answer
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Time Limit:
            </label>
            <div className="flex gap-2">
              {TIME_LIMITS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => onChange({ ...question, timeLimit: time })}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    question.timeLimit === time
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface QuestionListProps {
  questions: QuestionFormData[];
  onChange: (questions: QuestionFormData[]) => void;
}

export function QuestionList({ questions, onChange }: QuestionListProps) {
  const addQuestion = () => {
    const newQuestion: QuestionFormData = {
      id: `q-${Date.now()}`,
      text: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      timeLimit: 20,
    };
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (updatedQuestion: QuestionFormData) => {
    onChange(
      questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {questions.map((question, index) => (
          <QuestionForm
            key={question.id}
            question={question}
            index={index}
            onChange={updateQuestion}
            onRemove={() => removeQuestion(question.id)}
            canRemove={questions.length > 3}
          />
        ))}
      </AnimatePresence>

      <Button
        variant="outline"
        onClick={addQuestion}
        className="w-full py-6 border-2 border-dashed border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Question
      </Button>
    </div>
  );
}