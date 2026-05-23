"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createClient } from "~/lib/supabase/client";
import type { Department } from "~/lib/types"; // تأكد من تصدير الواجهة

export default function DepartmentForm() {
  const [department, setDepartment] = useState<Department | null>(null);
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [numLevels, setNumLevels] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const isEditing = !!id;

  useEffect(() => {
    if (!id) return;
    async function fetchDepartment() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          toast.error("فشل تحميل بيانات القسم", { description: error.message });
        } else if (data) {
          setDepartment(data);
          setTitle(data.title);
          setAbbreviation(data.abbreviation);
          setNumLevels(data.num_levels);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartment();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const payload = {
      title,
      abbreviation,
      num_levels: numLevels,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("departments")
        .update(payload)
        .eq("id", department!.id);
      error = result.error;
    } else {
      const result = await supabase.from("departments").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} القسم`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} القسم بنجاح`);
    revalidate();
    navigate("/dashboard/departments"); // يمكن تعديل المسار حسب مشروعك
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل قسم" : "إنشاء قسم جديد"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">اسم القسم</Label>
            <Input
              id="title"
              placeholder="أدخل اسم القسم..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviation">الاختصار</Label>
            <Input
              id="abbreviation"
              placeholder="مثال: CS"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_levels">عدد المستويات (السنوات)</Label>
            <Input
              id="num_levels"
              type="number"
              min={1}
              max={10}
              value={numLevels}
              onChange={(e) => setNumLevels(parseInt(e.target.value, 10) || 1)}
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !title.trim() || !abbreviation.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {isEditing ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
                </>
              ) : (
                <>{isEditing ? "حفظ التغييرات" : "إنشاء القسم"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
