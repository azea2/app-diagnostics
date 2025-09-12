import FloatingPanel from "./FloatingPanel";
import NavigationButton from "./NavigationButton";

const PageWithNavigation = ({ 
  children, 
  onBack, 
  onNext, 
  backText, 
  nextText,
  showBack = true,
  showNext = true
}) => {
  return (
    <div className="flex flex-col items-center">
      <FloatingPanel>{children}</FloatingPanel>
      <NavigationButton
        onBack={onBack || (() => console.log("Volver"))}
        onNext={onNext || (() => console.log("Continuar"))}
        backText={backText}
        nextText={nextText}
        showBack={showBack}
        showNext={showNext}
      />
    </div>
  );
};
export default PageWithNavigation;