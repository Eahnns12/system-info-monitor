import { useState, useRef, useEffect, createContext } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import { Item, Position } from "../enums";

const FILE = "setting.json";

interface SettingContextProps {
  trayItems: Item[];
  setTrayItems: React.Dispatch<React.SetStateAction<Item[]>>;
  panelPosition: Position;
  setPanelPosition: React.Dispatch<React.SetStateAction<Position>>;
  isPanelVisible: boolean;
  setIsPanelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const settingContext = createContext<SettingContextProps>({
  trayItems: [],
  setTrayItems: () => {},
  panelPosition: Position.TopLeft,
  setPanelPosition: () => {},
  isPanelVisible: false,
  setIsPanelVisible: () => {},
});

function SettingProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<LazyStore>(new LazyStore(FILE, { autoSave: true }));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trayItems, setTrayItems] = useState<Item[]>([]);
  const [panelPosition, setPanelPosition] = useState<Position>(0);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);

  async function init(): Promise<void> {
    storeRef.current.clear();

    const items = await storeRef.current.get<Item[]>("tray_items");
    const position = await storeRef.current.get<Position>("panel_position");
    const visibility = await storeRef.current.get<boolean>("panel_visibility");

    setTrayItems(items ?? [Item.Cpu, Item.Memory]);
    setPanelPosition(position ?? Position.TopLeft);
    setIsPanelVisible(visibility ?? true);
    setIsLoading(false);
  }

  useEffect(() => {
    storeRef.current.set("tray_items", trayItems);
  }, [trayItems]);

  useEffect(() => {
    storeRef.current.set("panel_position", panelPosition);
  }, [panelPosition]);

  useEffect(() => {
    storeRef.current.set("panel_visibility", isPanelVisible);
  }, [isPanelVisible]);

  useEffect(() => {
    init();
  }, []);

  return (
    <settingContext.Provider
      value={{
        trayItems,
        setTrayItems,
        panelPosition,
        setPanelPosition,
        isPanelVisible,
        setIsPanelVisible,
      }}
    >
      {!isLoading && children}
    </settingContext.Provider>
  );
}

export type { SettingContextProps };
export { settingContext, SettingProvider };
