import { useEffect, useRef } from "react";
import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { SettingContextProps } from "../contexts/setting-context";
import { Position } from "@tauri-apps/plugin-positioner";
import { Item } from "../enums";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";

function useTray(setting: SettingContextProps) {
  const trayIconRef = useRef<TrayIcon | null>(null);

  async function setTitle(title: string) {
    await trayIconRef.current?.setTitle(title);
  }

  async function init() {
    trayIconRef.current = await TrayIcon.getById("main");
    await trayIconRef.current?.setMenu(
      await Menu.new({
        items: [
          {
            text: "Tray",
            items: [
              {
                text: "CPU Usage",
                checked: setting.trayItems.includes(Item.Cpu),
                action: () => {
                  setting.setTrayItems((prev) => {
                    return prev.includes(Item.Cpu)
                      ? prev.filter((item) => item !== Item.Cpu)
                      : [...new Set([...prev, Item.Cpu])];
                  });
                },
              },
              {
                text: "Memory Usage",
                checked: setting.trayItems.includes(Item.Memory),
                action: () => {
                  setting.setTrayItems((prev) => {
                    return prev.includes(Item.Memory)
                      ? prev.filter((item) => item !== Item.Memory)
                      : [...new Set([...prev, Item.Memory])];
                  });
                },
              },
            ],
          },
          {
            text: "Show Panel",
            checked: setting.isPanelVisible,
            action: () => {
              setting.setIsPanelVisible((prev) => !prev);
            },
          },
          {
            text: "Position",
            items: [
              {
                text: "Top Left",
                action: () => setting.setPanelPosition(Position.TopLeft),
              },
              {
                text: "Top Right",
                action: () => setting.setPanelPosition(Position.TopRight),
              },
              {
                text: "Bottom Left",
                action: () => setting.setPanelPosition(Position.BottomLeft),
              },
              {
                text: "Bottom Right",
                action: () => setting.setPanelPosition(Position.BottomRight),
              },
            ],
          },
          {
            text: "Auto Start",
            checked: await isEnabled(),
            action: async () => {
              (await isEnabled()) ? await disable() : await enable();
            },
          },
          { item: "Separator" },
          { item: "Quit", text: "Quit" },
        ],
      }),
    );
  }

  useEffect(() => {
    init();
  }, []);

  return { setTitle };
}

export { useTray };
