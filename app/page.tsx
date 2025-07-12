"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Activity = {
  id: string;
  name: string;
  unit: string;
  weight: string;
  subActivities: SubActivity[];
};

type SubActivity = {
  id: string;
  name: string;
  unit: string;
  weight: string;
};

const mockdata: Activity[] = [
  {
    id: "1",
    name: "Pilling",
    unit: "Piers",
    weight: "50",
    subActivities: [
      { id: "1.1", name: "Pile Install", unit: "Piers", weight: "20" },
      { id: "1.2", name: "Pile Distrubution", unit: "Piers", weight: "20" },
      { id: "1.3", name: "Pile Testing", unit: "BOM Fasteners", weight: "10" },
    ],
  },
  {
    id: "2",
    name: "Mechanical",
    unit: "Modules",
    weight: "50",
    subActivities: [
      { id: "2.1", name: "Mechanical Distribution", unit: "Modules", weight: "25" },
      { id: "2.2", name: "Bolting", unit: "Modules", weight: "25" },
    ],
  },
];

export default function ActivityChecklist() {
  const [activities, setActivities] = useState<Activity[]>(mockdata);

  const totalWeight = activities.reduce((acc, activity) => {
    return (
      acc +
      activity.subActivities.reduce((subAcc, sub) => {
        return subAcc + parseFloat(sub.weight);
      }, 0)
    );
  }, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-xl font-semibold">Checklist</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Weight Percent:{" "}
            <span className="text-green-600 font-bold">{totalWeight} %</span>
          </p>
          <Button className="rounded-full w-8 h-8 text-lg font-bold">+</Button>
          <Button className="bg-red-400 hover:bg-red-500">Edit</Button>
        </div>
      </div>

      {/* Activities */}
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className="bg-white rounded-lg shadow-sm p-5 mt-4 w-full"
        >
          {/* Activity Header */}
          <div className="flex items-center mb-4">
            <span className="text-md font-semibold mr-3">{index + 1}</span>
            <p className="text-md font-semibold">Activity</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input value={activity.name} readOnly placeholder="Activity name" />
            <Input value={activity.unit} readOnly placeholder="Unit of count" />
            <div className="flex items-center gap-2">
              <Input value={activity.weight} readOnly placeholder="Weight" />
              <span className="text-sm">%</span>
              <Trash2 className="text-gray-400 hover:text-red-500 cursor-pointer" size={18} />
            </div>
          </div>

          {/* Sub-activities */}
          <div className="mt-4 ml-6 border-l border-gray-300 pl-4 space-y-3">
            {activity.subActivities.map((sub, subIndex) => (
              <div
                key={sub.id}
                className="grid grid-cols-3 gap-4 items-center"
              >
                <Input value={sub.name} readOnly placeholder="Sub-activity name" />
                <Input value={sub.unit} readOnly placeholder="Unit" />
                <div className="flex items-center gap-2">
                  <Input value={sub.weight} readOnly placeholder="Weight" />
                  <span className="text-sm">%</span>
                  <Trash2 className="text-gray-400 hover:text-red-500 cursor-pointer" size={18} />
                </div>
              </div>
            ))}

            <button className="text-blue-500 text-sm mt-1">+ Sub-activity</button>
          </div>
        </div>
      ))}
    </div>
  );
}
