import {  XOctagon } from 'lucide-react';

export default function ErrorDisplay({ 
  message, 
  title = "Error", 
  className = ""
}: { 
  message: string; 
  title?: string;
  className?: string;
}) {
  return (
    <div className={`
      w-full 
      bg-red-50 
      border 
      border-red-200 
      rounded-lg 
      p-4 
      flex 
      items-start 
      space-x-4 
      shadow-sm
      ${className}
    `}>
      <div className="flex-shrink-0">
        <XOctagon className="h-8 w-8 text-red-600 mt-1" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-semibold text-red-800 mr-2">
            {title}
          </h3>
        </div>
        <p className="text-red-700 text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}