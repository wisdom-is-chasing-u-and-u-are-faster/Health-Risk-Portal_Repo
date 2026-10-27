import React from 'react';
import { AscvdScore, DiabetesScore, MetabolicSyndromeScore } from '../types';
import { Heart, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskCardProps {
  ascvd: AscvdScore;
  diabetes: DiabetesScore;
  metabolic: MetabolicSyndromeScore;
}

export const RiskCard: React.FC<RiskCardProps> = ({ ascvd, diabetes, metabolic }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. ASCVD 10-Year Risk Card */}
      <div className="card border-t-4 border-t-blue-600 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AHA/ACC Pooled Cohort</span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-slate-900">10-Year ASCVD Risk</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">{ascvd.ten_year_risk_pct}%</span>
            <span className="text-xs text-slate-500 font-medium">{ascvd.risk_category}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${
                ascvd.ten_year_risk_pct >= 20
                  ? 'bg-rose-500'
                  : ascvd.ten_year_risk_pct >= 7.5
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(ascvd.ten_year_risk_pct * 3.3, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-2xs text-slate-400 font-mono">
            <span>0% (Low)</span>
            <span>7.5% (Borderline)</span>
            <span>20%+ (High)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
          <span>Target LDL Guideline:</span>
          <span className="font-semibold text-slate-900">{ascvd.target_ldl}</span>
        </div>
      </div>

      {/* 2. Type 2 Diabetes ADA Risk Card */}
      <div className="card border-t-4 border-t-emerald-600 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ADA 7-Factor Engine</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-slate-900">Type 2 Diabetes Risk</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">
              {diabetes.risk_score} <span className="text-lg font-normal text-slate-400">/ {diabetes.max_score}</span>
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{diabetes.risk_level}</span>
        </div>

        <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
          Score indicates elevated risk of dysglycemia. Fasting plasma glucose and HbA1c surveillance advised.
        </div>
      </div>

      {/* 3. Metabolic Syndrome Card */}
      <div className="card border-t-4 border-t-amber-600 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">NCEP ATP III Criteria</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-slate-900">Metabolic Syndrome</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {metabolic.criteria_met} of 5 <span className="text-xs font-normal text-slate-500">Criteria Met</span>
            </span>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
              metabolic.diagnosed ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {metabolic.diagnosed ? 'Metabolic Syndrome Present' : 'Diagnostic Threshold Not Met'}
          </span>
        </div>

        <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
          {metabolic.factors.map((factor, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
