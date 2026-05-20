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
import type { Level } from "~/lib/types";

export default function LevelForm() {
  const [level, setLevel] = useState<Level | null>(null);
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const isEditing = !!id;

  useEffect(() => {
    if (!id) return;

    async function fetchLevel() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("levels")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("فشل تحميل بيانات المستوى", {
            description: error.message,
          });
          return;
        }

        if (data) {
          setLevel(data);
          setTitle(data.title);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLevel();
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
        .from("levels")
        .update(payload)
        .eq("id", level!.id);
      error = result.error;
    } else {
      const result = await supabase.from("levels").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} المستوى`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} المستوى بنجاح`);
    revalidate();
    navigate("/dashboard/levels"); // يمكنك تعديل المسار حسب مشروعك
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>
          {isEditing ? "تعديل مستوى دراسي" : "إنشاء مستوى دراسي جديد"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">اسم المستوى</Label>
            <Input
              id="title"
              placeholder="مثال: المستوى الأول"
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
                <>{isEditing ? "حفظ التغييرات" : "إنشاء المستوى"}</>
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
