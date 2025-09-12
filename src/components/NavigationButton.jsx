const NavigationButton = ({
  onBack,
  onNext,
  backText = "← Volver",
  nextText = "Continuar →",
  showBack = true,
  showNext = true,
  className = "",
}) => {
  // Si solo hay un botón, centramos. Si hay dos, separamos.
  const justifyClass = showBack && showNext ? "justify-between" : "justify-center";

  return (
    <div className={`flex ${justifyClass} mt-6 w-full max-w-xl ${className}`}>
      {showBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 shadow"
        >
          {backText}
        </button>
      )}

      {showNext && (
        <button
          onClick={onNext}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 shadow"
        >
          {nextText}
        </button>
      )}
    </div>
  );
};

export default NavigationButton;