import { createClient } from "~/lib/supabase/client";
import { InstructorsTable } from "./instructors-table";
import { useEffect, useState } from "react";

export default function Instructors() {
  const supabase = createClient();

  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstructors() {
      const { data, error } = await supabase
        .from("instructors")
        .select("*");

      if (error) {
        console.error("Error fetching instructors:", error);
      } else {
        setInstructors(data || []); 
      }
      setLoading(false);
    }

    fetchInstructors();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="p-4">
      <InstructorsTable data={instructors} />
    </div>
  );
}
