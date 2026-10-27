import React, { useState } from 'react';
import { LifestyleRecommendation } from '../types';
import { ChevronDown, ChevronUp, Utensils, Dumbbell, Stethoscope, Pill, Cigarette } from 'lucide-react';

interface LifestyleAccordionProps {
  recommendations: LifestyleRecommendation[];
}

export const LifestyleAccordion: React.FC<LifestyleAccordionProps> = ({ recommendations }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const toggle = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Diet & Nutrition':
        return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'Physical Activity':
        return <Dumbbell className="w-5 h-5 text-blue-600" />;
      case 'Medication & Therapy':
        return <Pill className="w-5 h-5 text-purple-600" />;
      case 'Smoking Cessation':
        return <Cigarette className="w-5 h-5 text-rose-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div
            key={index}
            className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  {getCategoryIcon(rec.category)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{rec.category}</h4>
                  <span className="text-xs text-slate-500 line-clamp-1">{rec.action}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    rec.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {rec.priority} Priority
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-sm text-slate-700 border-t border-slate-100 bg-slate-50/50">
                <p className="leading-relaxed">{rec.action}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                  <span>HL7 FHIR R4 CarePlan Protocol Guideline</span>
                  <span className="text-blue-600 font-medium">Evidence Level A</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
