import { createClient } from "~/lib/supabase/client";
import { BatchesTable } from "./batches-table";
import { useEffect, useState } from "react";

export default function Batches() {
  const supabase = createClient();

  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      const { data, error } = await supabase
        .from("batches")
        .select("*,department:departments!department_id(title),level:levels(title)");

      if (error) {
        console.error("Error fetching batches:", error);
      } else {
        setBatches(data || []); 
      }
      setLoading(false);
    }

    fetchBatches();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return  <div className="p-4">
      <BatchesTable data={batches} />
  </div>
}
