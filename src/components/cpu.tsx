import { memo, useEffect, useMemo, useState } from "react";
import { CpusInfo } from "../apis/sysinfo";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const COLLECTION_MAX_LENGTH = 20;

const Cpu = memo(({ cpusInfo }: { cpusInfo: CpusInfo | null }) => {
  const [cpusInfos, setCpusInfos] = useState<CpusInfo[]>([]);
  const averageCpuUsageCollection = useMemo(() => {
    return cpusInfos.map((cpusInfo) => ({
      usage:
        cpusInfo.cpuUsages.reduce((acc, curr) => acc + curr, 0) /
        cpusInfo.cpuUsages.length,
    }));
  }, [cpusInfos]);
  const cpuUsage =
    (cpusInfo?.cpuUsages.reduce((acc, curr) => acc + curr, 0) || 1) /
    (cpusInfo?.cpuUsages.length || 1);
  const cpuName = cpusInfo?.brands[0].replace(cpusInfo.vendorIds[0], "");
  const cpuFrequency = cpusInfo?.frequencies[0];

  useEffect(() => {
    if (cpusInfo === null) return;

    setCpusInfos((prev) => {
      const newCollection = [...prev, cpusInfo];

      if (newCollection.length > COLLECTION_MAX_LENGTH) {
        newCollection.shift();
      }

      return newCollection;
    });
  }, [cpusInfo]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#F0F0F5] bg-[#FFFFFF] shadow-xl dark:border-[#1D1D1F] dark:bg-[#1D1D1F]">
      <div className="absolute inset-0 z-10 flex h-full w-full flex-col gap-3 p-3 text-[#1D1D1F] dark:text-[#FFFFFF]">
        <p className="truncate text-sm font-semibold">
          {cpuName} &#183; {cpuFrequency}MHz
        </p>

        <div className="space-y-0.5">
          <p className="text-xs text-[#6E6E73]/75 dark:text-[#8E8E93]/75">
            Average Usage
          </p>
          <p className="text-xl font-extrabold text-[#1D1D1F] dark:text-[#FFFFFF]">
            {cpuUsage.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="absolute inset-0 h-full w-full scale-110">
        <ResponsiveContainer>
          <AreaChart data={averageCpuUsageCollection}>
            <CartesianGrid horizontal={false} opacity={0.05} />
            <XAxis
              interval={3}
              tickSize={0}
              axisLine={false}
              orientation="top"
              height={45}
              tickFormatter={() => ""}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tick={false}
              width={-1}
              tickLine={false}
              tickFormatter={() => ""}
            />
            <Area
              type="basis"
              dataKey="usage"
              strokeWidth={2}
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#color)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export { Cpu };
