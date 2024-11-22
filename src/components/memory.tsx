import { memo } from "react";
import { MemoryInfo } from "../apis/sysinfo";
import { PieChart, ResponsiveContainer, Pie, Cell, Label } from "recharts";

const Memory = memo(({ memoryInfo }: { memoryInfo: MemoryInfo | null }) => {
  const totalMemory = memoryInfo?.totalMemory || 0;
  const usedMemory = memoryInfo?.usedMemory || 0;
  const usedPercentage = Number(((usedMemory / totalMemory) * 100).toFixed(2));
  const freePercentage = Number((100 - usedPercentage).toFixed(2));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#F0F0F5] bg-[#FFFFFF] shadow-lg dark:border-[#1D1D1F] dark:bg-[#1D1D1F]">
      <div className="absolute inset-0 z-10 flex h-full w-full flex-col p-3 text-[#1D1D1F] dark:text-[#FFFFFF]">
        <p className="text-sm font-semibold">Meomry</p>
        <p className="text-xs text-[#6E6E73]/75 dark:text-[#8E8E93]/75">
          {totalMemory / 1024 / 1024 / 1024}GB
        </p>
      </div>
      <div className="absolute inset-0 h-full w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[{ value: freePercentage }, { value: usedPercentage }]}
              cx="50%"
              cy="65%"
              innerRadius="50%"
              outerRadius="85%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={8}
              stroke="none"
              dataKey="value"
              cornerRadius={5}
            >
              <Cell
                fill={
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "#2E2E30"
                    : "#F0F0F5"
                }
                stroke={
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "#3A3A3C"
                    : "#C6C6C8"
                }
                strokeWidth={2}
              />
              <Cell fill="url(#color)" stroke="#8884d8" strokeWidth={2} />
              <Label
                value={`${usedPercentage.toFixed(0)}%`}
                position="center"
                fill={
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "#8E8E93"
                    : "#6E6E73"
                }
                fontSize={12}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export { Memory };
