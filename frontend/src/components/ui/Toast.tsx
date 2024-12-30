import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const Toast = ({ message, variant = "info", duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible) return null;

  const variants = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      iconColor: "text-green-500",
    },
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-500",
    },
  };

  const {
    icon: Icon,
    bgColor,
    textColor,
    borderColor,
    iconColor,
  } = variants[variant];

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-2 p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor} shadow-lg max-w-md`}
        role="alert">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className={`p-1 hover:opacity-70 transition-opacity ${textColor}`}
          aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
