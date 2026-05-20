import { createClient } from "~/lib/supabase/client";
import { SubjectsTable } from "./subjects-table";
import { useEffect, useState } from "react";

export default function Departments() {
  const supabase = createClient();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from("subjects")
        .select("*, parent:parent_id(title)");

      if (error) {
        console.error("Error fetching subjects:", error);
      } else {
        setSubjects(data || []); 
      }
      setLoading(false);
    }

    fetchSubjects();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return  <div className="p-4">
      <SubjectsTable data={subjects} />
  </div>
}
