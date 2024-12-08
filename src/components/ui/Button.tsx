interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon';
    children: React.ReactNode;
  }
  
  export function Button({ variant = 'secondary', children, className, ...props }: ButtonProps) {
    const baseStyles = "rounded-full font-medium transition-colors";
    const variants = {
      primary: "bg-cyan-500 text-white px-6 py-2 hover:bg-cyan-600",
      secondary: "bg-gray-100 text-gray-700 px-6 py-2 hover:bg-gray-200",
      icon: "p-2 hover:bg-gray-100"
    };
  
    return (
      <button 
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }