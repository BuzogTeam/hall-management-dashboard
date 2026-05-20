"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { createClient } from "~/lib/supabase/client";
import type { Instructor } from "~/lib/types";

const INSTRUCTOR_TYPES = [
  { value: "دكتور", label: "دكتور" },
  { value: "مهندس", label: "مهندس" },
  { value: "استاذ", label: "أستاذ" },
] as const;

export default function InstructorForm() {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [type, setType] = useState<Instructor["type"]>("دكتور");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const isEditing = !!id;

  useEffect(() => {
    if (!id) return;
    async function fetchInstructor() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("instructors")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          toast.error("فشل تحميل بيانات الأستاذ", {
            description: error.message,
          });
          return;
        }
        if (data) {
          setInstructor(data);
          setName(data.name);
          setType(data.type);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInstructor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const payload = {
      name,
      type,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("instructors")
        .update(payload)
        .eq("id", instructor!.id);
      error = result.error;
    } else {
      const result = await supabase.from("instructors").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} الأستاذ`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} الأستاذ بنجاح`);
    revalidate();
    navigate("/dashboard/instructors");
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل أستاذ" : "إضافة أستاذ جديد"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم */}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              placeholder="أدخل اسم الأستاذ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* النوع */}
          <div className="space-y-2">
            <Label htmlFor="type">الصفة</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as Instructor["type"])}
              required
              disabled={loading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="اختر الصفة" />
              </SelectTrigger>
              <SelectContent>
                {INSTRUCTOR_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {isEditing ? "جارٍ الحفظ..." : "جارٍ الإضافة..."}
                </>
              ) : (
                <>{isEditing ? "حفظ التغييرات" : "إضافة الأستاذ"}</>
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
