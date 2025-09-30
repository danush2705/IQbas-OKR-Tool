import React from "react";

interface StatCardProps {
  value: React.ReactNode;
  label: string;
  children?: React.ReactNode;
}

export function StatCard({ value, label, children }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-card-border">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span>{label}</span>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


