  interface LoadingSpinnerProps {
    message?: string;
}
export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-full">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500`}></div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    );
  }