import { SectionCards, type SectionCardItem } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import data from "./data.json";
const sectionItems: SectionCardItem[] = [
  {
    description: "Total Revenue",
    value: "$1,250.00",
    trend: { direction: "up", text: "+12.5%" },
    footerPrimary: "Trending up this month",
    footerSecondary: "Visitors for the last 6 months",
  },
  {
    description: "New Customers",
    value: "1,234",
    trend: { direction: "down", text: "-20%" },
    footerPrimary: "Down 20% this period",
    footerSecondary: "Acquisition needs attention",
  },
  {
    description: "Active Accounts",
    value: "45,678",
    trend: { direction: "up", text: "+12.5%" },
    footerPrimary: "Strong user retention",
    footerSecondary: "Engagement exceed targets",
  },
  {
    description: "Growth Rate",
    value: "4.5%",
    trend: { direction: "up", text: "+4.5%" },
    footerPrimary: "Steady performance increase",
    footerSecondary: "Meets growth projections",
  },
];

export default function Page() {
  return (
    <div className="flex flex-1 flex-col lg:px-12">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="pl-4 py-4">
          <h1 className="text-2xl font-semibold text-black dark:text-white">Overview</h1>
        </div>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
          <SectionCards items={sectionItems} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
