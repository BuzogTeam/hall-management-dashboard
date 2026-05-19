import { createClient } from "~/lib/supabase/client";
import { DepartmentsTable } from "./departments-table";
import { useEffect, useState } from "react";

export default function Departments() {
  const supabase = createClient();

  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      const { data, error } = await supabase
        .from("departments")
        .select("*");

      if (error) {
        console.error("Error fetching departments:", error);
      } else {
        setDepartments(data || []); 
      }
      setLoading(false);
    }

    fetchDepartments();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return  <div className="p-4">
      <DepartmentsTable data={departments} />
  </div>
}
