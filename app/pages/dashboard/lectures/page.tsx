import { createClient } from "~/lib/supabase/client";
import { useEffect, useState } from "react";
import { LecturesTable } from "./lectures-table";

export default function Lectures() {
  const supabase = createClient();

  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLectures() {
      const { data, error } = await supabase
        .from("lectures")
        .select(
          "*, hall:hall_id(title), batch:batch_id(department_abbr), subject:subject_id(title), instructor:instructor_id(name)",
        );

      if (error) {
        console.error("Error fetching lectures:", error);
      } else {
        setLectures(data || []);
      }
      setLoading(false);
    }

    fetchLectures();
  }, []);

  if (loading) {
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="p-4">
      <LecturesTable data={lectures} />
    </div>
  );
}
