const FloatingPanel = ({ children, maxWidth = "max-w-5xl", minHeight = "min-h-[400px]" }) => {
  return (
    <div className="flex justify-center items-center bg-gray-50 py-8">
      <div
        className={`bg-white shadow-2xl ring-1 ring-gray-200 rounded-2xl p-8 w-full ${maxWidth} ${minHeight} mx-4`}
      >
        {children}
      </div>
    </div>
  );
};

export default FloatingPanel;