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
import type { Building } from "~/lib/types"; // تأكد من تصدير الواجهة من ملف الأنواع

export default function BuildingForm() {
  const [building, setBuilding] = useState<Building | null>(null);
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const isEditing = !!id;

  useEffect(() => {
    if (!id) return;

    async function fetchBuilding() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("buildings")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("فشل تحميل بيانات المبنى", {
            description: error.message,
          });
          return;
        }

        if (data) {
          setBuilding(data);
          setTitle(data.title);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBuilding();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const payload = {
      title,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from("buildings")
        .update(payload)
        .eq("id", building!.id);
      error = result.error;
    } else {
      const result = await supabase.from("buildings").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} المبنى`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} المبنى بنجاح`);
    revalidate();
    navigate("/dashboard/buildings"); // افترض وجود مسار المباني
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل مبنى" : "إنشاء مبنى جديد"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">اسم المبنى</Label>
            <Input
              id="title"
              placeholder="أدخل اسم المبنى..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {isEditing ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
                </>
              ) : (
                <>{isEditing ? "حفظ التغييرات" : "إنشاء المبنى"}</>
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
