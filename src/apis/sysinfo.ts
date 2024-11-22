import { invoke } from "@tauri-apps/api/core";

type SystemInfo = {
  name: string;
  kernelVersion: string;
  osVersion: string;
  hostName: string;
  bootTime: number;
};

type CpuInfo = {
  globalCpuUsage: number;
};

type CpusInfo = {
  names: string[];
  vendorIds: string[];
  brands: string[];
  frequencies: number[];
  cpuUsages: number[];
};

type MemoryInfo = {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  totalSwap: number;
  usedSwap: number;
  freeSwap: number;
};

async function getSystemInfo(): Promise<SystemInfo> {
  try {
    const data = await invoke<{
      name: string;
      kernel_version: string;
      os_version: string;
      host_name: string;
      boot_time: number;
    }>("get_system_info");

    return {
      name: data.name,
      kernelVersion: data.kernel_version,
      osVersion: data.os_version,
      hostName: data.host_name,
      bootTime: data.boot_time,
    };
  } catch (error) {
    return {
      name: "",
      kernelVersion: "",
      osVersion: "",
      hostName: "",
      bootTime: 0,
    };
  }
}

async function getCpuInfo(): Promise<CpuInfo> {
  try {
    const data = await invoke<{
      global_cpu_usage: number;
    }>("get_cpu_info");

    return {
      globalCpuUsage: data.global_cpu_usage,
    };
  } catch (error) {
    return {
      globalCpuUsage: 0,
    };
  }
}

async function getCpusInfo(): Promise<CpusInfo> {
  try {
    const data = await invoke<{
      names: string[];
      vendor_ids: string[];
      brands: string[];
      frequencies: number[];
      cpu_usages: number[];
    }>("get_cpus_info");

    return {
      names: data.names,
      vendorIds: data.vendor_ids,
      brands: data.brands,
      frequencies: data.frequencies,
      cpuUsages: data.cpu_usages,
    };
  } catch (error) {
    return {
      names: [],
      vendorIds: [],
      brands: [],
      frequencies: [],
      cpuUsages: [],
    };
  }
}

async function getMemoryInfo(): Promise<MemoryInfo> {
  try {
    const data = await invoke<{
      total_memory: number;
      used_memory: number;
      free_memory: number;
      total_swap: number;
      used_swap: number;
      free_swap: number;
    }>("get_memory_info");

    return {
      totalMemory: data.total_memory,
      usedMemory: data.used_memory,
      freeMemory: data.free_memory,
      totalSwap: data.total_swap,
      usedSwap: data.used_swap,
      freeSwap: data.free_swap,
    };
  } catch (error) {
    return {
      totalMemory: 0,
      usedMemory: 0,
      freeMemory: 0,
      totalSwap: 0,
      usedSwap: 0,
      freeSwap: 0,
    };
  }
}

export type { SystemInfo, CpuInfo, CpusInfo, MemoryInfo };
export { getSystemInfo, getCpuInfo, getCpusInfo, getMemoryInfo };
