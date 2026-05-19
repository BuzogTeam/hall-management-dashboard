import { createClient } from "~/lib/supabase/client";
import { BuildingsTable } from "./buildings-table";
import { useEffect, useState } from "react";

export default function Buildings() {
  const supabase = createClient();

  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuildings() {
      const { data, error } = await supabase
        .from("buildings")
        .select("*");

      if (error) {
        console.error("Error fetching buildings:", error);
      } else {
        setBuildings(data || []); 
      }
      setLoading(false);
    }

    fetchBuildings();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return  <div className="p-4">
      <BuildingsTable data={buildings} />
  </div>
}
