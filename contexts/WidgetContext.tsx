import * as React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type WidgetContextType = {
  refreshWidget: () => void;
  widgetData: any;
  setWidgetData: (data: any) => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const [widgetData, setWidgetData] = useState(null);

  const refreshWidget = useCallback(() => {
    console.log('Widget refresh requested');
    // In a real implementation, this would update widget data
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget, widgetData, setWidgetData }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
