"use client";
import { useEffect, useState } from "react";
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

export default function ActivityChecklist() {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/activities");
      const data = await res.json();
      setActivities(data);
    };

    fetchActivities();
  }, []);

  // const totalWeight = activities.reduce((acc, activity) => {
  //   return (
  //     acc +
  //     activity.subActivities.reduce((subAcc, sub) => {
  //       return subAcc + parseFloat(sub.weight);
  //     }, 0)
  //   );
  // }, 0);

const completedActivities = activities.filter(activity => {
  const subWeightSum = activity.subActivities.reduce(
    (acc, sub) => acc + parseFloat(sub.weight),
    0
  );
  return subWeightSum === 100;
}).length;

  const totalProgress = (completedActivities / activities.length) * 100;

  const handleAddActivity = async () => {
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const newActivity = await res.json();
    setActivities((prev) => [...prev, newActivity]);
  };

  const updateActivity = async (
    id: string,
    field: string,
    value: string | number
  ) => {
    await fetch(`/api/activities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  };

  // add subactivity
  const handleAddSubActivity = async (activityId: string) => {
    const res = await fetch("/api/subactivities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });

    const newSub = await res.json();

    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? { ...activity, subActivities: [...activity.subActivities, newSub] }
          : activity
      )
    );
  };

  const updateSubActivity = async (
    id: string,
    field: string,
    value: string | number
  ) => {
    await fetch(`/api/subactivities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  };

  const deleteSubActivity = async (activityId: string, subId: string) => {
    await fetch(`/api/subactivities/${subId}`, {
      method: "DELETE",
    });

    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              subActivities: a.subActivities.filter((s) => s.id !== subId),
            }
          : a
      )
    );
  };

  const deleteActivity = async (id: string) => {
    await fetch(`/api/activities/${id}`,{
      method:"DELETE",
    })

     setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-xl font-semibold">Checklist</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Weight Percent:{" "}
            <span className="text-green-600 font-bold">{totalProgress} %</span>
          </p>
          <Button
            onClick={handleAddActivity}
            className="rounded-full w-8 h-8 text-lg font-bold"
          >
            +
          </Button>
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
            <Input
              value={activity.name}
              onChange={(e) => {
                const value = e.target.value;
                updateActivity(activity.id, "name", value);
                setActivities((prev) =>
                  prev.map((a) =>
                    a.id === activity.id ? { ...a, name: value } : a
                  )
                );
              }}
              placeholder="Activity name"
            />

            <Input
              value={activity.unit}
              onChange={(e) => {
                const value = e.target.value;
                updateActivity(activity.id, "unit", value);
                setActivities((prev) =>
                  prev.map((a) =>
                    a.id === activity.id ? { ...a, unit: value } : a
                  )
                );
              }}
              placeholder="Unit of count"
            />

            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={activity.subActivities.reduce(
                  (acc, s) => acc + Number(s.weight),
                  0
                )}
                readOnly
                disabled
                onChange={(e) => {
                  const value = e.target.value;
                  setActivities((prev) =>
                    prev.map((a) =>
                      a.id === activity.id ? { ...a, weight: value } : a
                    )
                  );
                }}
                placeholder="Weight"
              />
              {/* <Input value={activity.weight} placeholder="Weight" /> */}
              <span className="text-sm">%</span>
              <Trash2
                className="text-gray-400 hover:text-red-500 cursor-pointer"
                size={18}
                onClick={()=>deleteActivity(activity.id)}
              />
            </div>
          </div>

          {/* Sub-activities */}
          <div className="mt-4 ml-6 border-l border-gray-300 pl-4 space-y-3">
            {activity.subActivities.map((sub, subIndex) => (
              <div
                key={subIndex}
                className="grid grid-cols-3 gap-4 items-center"
              >
                <Input
                  value={sub.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSubActivity(sub.id, "name", value);
                    setActivities((prev) =>
                      prev.map((a) =>
                        a.id === activity.id
                          ? {
                              ...a,
                              subActivities: a.subActivities.map((s) =>
                                s.id === sub.id ? { ...s, name: value } : s
                              ),
                            }
                          : a
                      )
                    );
                    // TODO: Add PUT request here later
                  }}
                  placeholder="Sub-activity name"
                />
                <Input
                  value={sub.unit}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSubActivity(sub.id, "unit", value);
                    setActivities((prev) =>
                      prev.map((a) =>
                        a.id === activity.id
                          ? {
                              ...a,
                              subActivities: a.subActivities.map((s) =>
                                s.id === sub.id ? { ...s, unit: value } : s
                              ),
                            }
                          : a
                      )
                    );
                    // TODO: Add PUT request here later
                  }}
                  placeholder="Unit"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={sub.weight}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateSubActivity(sub.id, "weight", value);
                      setActivities((prev) =>
                        prev.map((a) =>
                          a.id === activity.id
                            ? {
                                ...a,
                                subActivities: a.subActivities.map((s) =>
                                  s.id === sub.id ? { ...s, weight: value } : s
                                ),
                              }
                            : a
                        )
                      );
                      // TODO: Add PUT request here later
                    }}
                    placeholder="Weight"
                  />
                  <span className="text-sm">%</span>
                  <Trash2
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    size={18}
                    onClick={() => deleteSubActivity(activity.id, sub.id)}
                  />
                </div>
              </div>
            ))}

            <button
              className="text-blue-500 text-sm mt-1"
              onClick={() => handleAddSubActivity(activity.id)}
            >
              + Sub-activity
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
