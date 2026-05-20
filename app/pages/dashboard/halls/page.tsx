import { createClient } from "~/lib/supabase/client";
import { HallsTable } from "./halls-table";
import { useEffect, useState } from "react";

export default function Halls() {
  const supabase = createClient();

  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHalls() {
      const { data, error } = await supabase
        .from("halls")
        .select("*, building:buildings(title)");

      if (error) {
        console.error("Error fetching halls:", error);
      } else {
        setHalls(data || []); 
      }
      setLoading(false);
    }

    fetchHalls();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  

  return  <div className="p-4">
      <HallsTable data={halls} />
  </div>
}
