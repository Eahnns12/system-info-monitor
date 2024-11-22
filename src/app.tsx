import { useContext, useEffect, useMemo } from "react";
import { useTray, useWindow, useInfo } from "./hooks";
import { settingContext } from "./contexts";
import { Cpu, Memory } from "./components";
import { Item } from "./enums";

function App() {
  const setting = useContext(settingContext);
  const info = useInfo(setting);
  const tray = useTray(setting);
  useWindow(setting);

  const trayItemsString = useMemo(() => {
    return setting.trayItems
      .map((item) => {
        switch (item) {
          case Item.Cpu:
            return `CPU ${info.cpu?.globalCpuUsage.toFixed(0)}%`;
          case Item.Memory:
            return `MEM ${(
              ((info.memory?.usedMemory || 0) /
                (info.memory?.totalMemory || 0)) *
              100
            ).toFixed(0)}%`;
        }
      })
      .filter(Boolean)
      .join(" | ");
  }, [info.cpu, info.memory, setting.trayItems]);

  useEffect(() => {
    tray.setTitle(trayItemsString);
  }, [trayItemsString]);

  useEffect(() => {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  });

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </svg>

      <main className="flex h-dvh w-dvw cursor-default select-none p-4 transition-opacity duration-500 focus-within:opacity-20 hover:opacity-20">
        <div className="grid flex-1 select-none grid-cols-12 grid-rows-12 gap-2 overflow-hidden rounded-2xl bg-[#FFFFFF]/80 p-2 dark:bg-[#2C2C2E]/80">
          <div className="col-span-8 row-span-10">
            <Cpu cpusInfo={info.cpus} />
          </div>
          <div className="col-span-4 row-span-12">
            <Memory memoryInfo={info.memory} />
          </div>
          <div className="col-span-8 row-span-2">
            <div className="flex h-full w-full items-center text-[#6E6E73] dark:text-[#8E8E93]">
              <p className="text-xs">
                {info.system?.name} {info.system?.osVersion}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export { App };
