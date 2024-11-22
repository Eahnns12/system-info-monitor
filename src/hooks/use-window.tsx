import { useEffect, useRef } from "react";
import { Window } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { moveWindow } from "@tauri-apps/plugin-positioner";
import { SettingContextProps } from "../contexts/setting-context";

function useWindow(setting: SettingContextProps): {
  toggleWindowVisibility: (visible: boolean) => Promise<void>;
  ignoreCursorEvents: () => Promise<void>;
  setCursorEvents: () => Promise<void>;
} {
  const windowRef = useRef<Window | null>(null);
  const webviewRef = useRef<WebviewWindow | null>(null);

  async function toggleWindowVisibility(visible: boolean): Promise<void> {
    await windowRef.current?.[visible ? "show" : "hide"]();
  }

  async function init() {
    windowRef.current = await Window.getByLabel("main");
    webviewRef.current = await WebviewWindow.getByLabel("main");
    await toggleWindowVisibility(setting.isPanelVisible);
    await moveWindow(setting.panelPosition);

    windowRef.current?.onFocusChanged(async ({ payload }) => {
      if (payload) {
        await ignoreCursorEvents();
      } else {
        await setCursorEvents();
      }
    });
  }

  async function ignoreCursorEvents() {
    await windowRef.current?.setIgnoreCursorEvents(true);
    await webviewRef.current?.setIgnoreCursorEvents(true);
  }

  async function setCursorEvents() {
    await windowRef.current?.setIgnoreCursorEvents(false);
    await webviewRef.current?.setIgnoreCursorEvents(false);
  }

  useEffect(() => {
    toggleWindowVisibility(setting.isPanelVisible);
  }, [setting.isPanelVisible]);

  useEffect(() => {
    moveWindow(setting.panelPosition);
  }, [setting.panelPosition]);

  useEffect(() => {
    init();
  }, []);

  return { toggleWindowVisibility, ignoreCursorEvents, setCursorEvents };
}

export { useWindow };
