import { createClient } from "~/lib/supabase/client";
import { LevelsTable } from "./levels-table";
import { useEffect, useState } from "react";

export default function Levels() {
  const supabase = createClient();

  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLevels() {
      const { data, error } = await supabase
        .from("levels")
        .select("*");

      if (error) {
        console.error("Error fetching levels:", error);
      } else {
        setLevels(data || []);
      }
      setLoading(false);
    }

    fetchLevels();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  

  return  <div className="p-4">
      <LevelsTable data={levels} />
  </div>
}
