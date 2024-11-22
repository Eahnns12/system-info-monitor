import { useEffect, useState, useRef, useMemo } from "react";
import { SettingContextProps } from "../contexts/setting-context";
import { SystemInfo, CpuInfo, MemoryInfo, CpusInfo } from "../apis/sysinfo";
import {
  getSystemInfo,
  getCpuInfo,
  getCpusInfo,
  getMemoryInfo,
} from "../apis/sysinfo";
import { Item } from "../enums";

const CPU_FETCH_INTERVAL = 5000;
const CPUS_FETCH_INTERVAL = 2000;
const MEMORY_FETCH_INTERVAL = 5000;

function useInfo(setting: SettingContextProps): {
  system: SystemInfo | null;
  cpu: CpuInfo | null;
  cpus: CpusInfo | null;
  memory: MemoryInfo | null;
} {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [cpuInfo, setCpuInfo] = useState<CpuInfo | null>(null);
  const [cpusInfo, setCpusInfo] = useState<CpusInfo | null>(null);
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);

  const cpuIntervalRef = useRef<number | null>(null);
  const cpusIntervalRef = useRef<number | null>(null);
  const memoryIntervalRef = useRef<number | null>(null);

  const isCpuInfoNeedFetch = useMemo(() => {
    return setting.trayItems.includes(Item.Cpu);
  }, [setting.trayItems]);

  const isCpusInfoNeedFetch = useMemo(() => {
    return setting.isPanelVisible;
  }, [setting.isPanelVisible]);

  const isMemoryInfoNeedFetch = useMemo(() => {
    return setting.trayItems.includes(Item.Memory) || setting.isPanelVisible;
  }, [setting.trayItems, setting.isPanelVisible]);

  function intervalHandler(
    isFetchNeeded: boolean,
    timer: React.MutableRefObject<number | null>,
    fetcher: () => Promise<void>,
    interval: number,
  ) {
    if (timer.current) clearInterval(timer.current);

    if (isFetchNeeded) {
      fetcher();
      timer.current = setInterval(fetcher, interval);
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }

  useEffect(() => {
    return intervalHandler(
      isCpuInfoNeedFetch,
      cpuIntervalRef,
      async () => setCpuInfo(await getCpuInfo()),
      CPU_FETCH_INTERVAL,
    );
  }, [isCpuInfoNeedFetch]);

  useEffect(() => {
    return intervalHandler(
      isCpusInfoNeedFetch,
      cpusIntervalRef,
      async () => setCpusInfo(await getCpusInfo()),
      CPUS_FETCH_INTERVAL,
    );
  }, [isCpusInfoNeedFetch]);

  useEffect(() => {
    return intervalHandler(
      isMemoryInfoNeedFetch,
      memoryIntervalRef,
      async () => setMemoryInfo(await getMemoryInfo()),
      MEMORY_FETCH_INTERVAL,
    );
  }, [isMemoryInfoNeedFetch]);

  useEffect(() => {
    (async () => {
      setSystemInfo(await getSystemInfo());
    })();
  }, []);

  return {
    system: systemInfo,
    cpu: cpuInfo,
    cpus: cpusInfo,
    memory: memoryInfo,
  };
}

export { useInfo };
