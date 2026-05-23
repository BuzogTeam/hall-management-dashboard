"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createClient } from "~/lib/supabase/client";
import type { Building } from "~/lib/types";

export default function BuildingForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  // ✅ إنشاء العميل مرة واحدة فقط
  const supabase = useMemo(() => createClient(), []);

  const [building, setBuilding] = useState<Building | null>(null);
  const [title, setTitle] = useState("");

  // ✅ الفصل بين حالات التحميل المختلفة
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!id;
  const isBusy = fetching || submitting;

  // ✅ جلب بيانات المبنى عند التعديل
  useEffect(() => {
    if (!id) return;

    // ✅ منع تحديث الـ state إذا تم إلغاء المكوّن (تجنّب race conditions)
    let cancelled = false;

    async function fetchBuilding() {
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from("buildings")
          .select("*")
          .eq("id", id)
          .single();

        if (cancelled) return;

        if (error) {
          toast.error("فشل تحميل بيانات المبنى", {
            description: error.message,
          });
          // ✅ توجيه المستخدم بعيداً عند فشل التحميل
          navigate("/dashboard/buildings");
          return;
        }

        if (data) {
          setBuilding(data);
          setTitle(data.title ?? "");
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "حدث خطأ غير متوقع";
        toast.error("فشل تحميل بيانات المبنى", { description: message });
        console.error("خطأ غير متوقع:", err);
      } finally {
        if (!cancelled) setFetching(false);
      }
    }

    fetchBuilding();

    return () => {
      cancelled = true;
    };
  }, [id, supabase, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("الرجاء إدخال اسم المبنى");
      return;
    }

    // ✅ التحقق من توفر بيانات المبنى عند التعديل
    if (isEditing && !building?.id) {
      toast.error("تعذّر تحديد المبنى المراد تعديله");
      return;
    }

    setSubmitting(true);

    try {
      let error;

      if (isEditing && building) {
        const result = await supabase
          .from("buildings")
          .update({
            title: trimmedTitle,
            updated_at: new Date().toISOString(),
          })
          .eq("id", building.id);
        error = result.error;
      } else {
        const result = await supabase
          .from("buildings")
          .insert({ title: trimmedTitle });
        error = result.error;
      }

      if (error) {
        toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} المبنى`, {
          description: error.message,
        });
        return;
      }

      toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} المبنى بنجاح`);
      revalidate();
      navigate("/dashboard/buildings");
    } catch (err) {
      // ✅ التقاط الأخطاء غير المتوقعة (شبكة، JSON، إلخ.)
      const message =
        err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} المبنى`, {
        description: message,
      });
      console.error("خطأ غير متوقع أثناء الإرسال:", err);
    } finally {
      // ✅ ضمان إيقاف حالة الإرسال في جميع الحالات
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل مبنى" : "إنشاء مبنى جديد"}</CardTitle>
      </CardHeader>
      <CardContent>
        {fetching && !building ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            <span>جارٍ تحميل بيانات المبنى...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">اسم المبنى</Label>
              <Input
                id="title"
                placeholder="أدخل اسم المبنى..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isBusy}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isBusy || !title.trim()}>
                {submitting ? (
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
                onClick={() => navigate(-1)}
                disabled={isBusy}
              >
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
