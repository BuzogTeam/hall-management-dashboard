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
import type { Subject } from "~/lib/types";

const SUBJECT_TYPES = [
  { value: "نظري", label: "نظري" },
  { value: "تمارين", label: "تمارين" },
  { value: "عملي", label: "عملي" },
] as const;

export default function SubjectForm() {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [englishTitle, setEnglishTitle] = useState("");
  const [type, setType] = useState<Subject["type"]>("نظري");
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const isEditing = !!id;

  // جلب كل المواد (لاستخدامها كقائمة للمادة الأم)
  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase
        .from("subjects")
        .select("id, title");
      if (error) {
        toast.error("فشل تحميل المواد", { description: error.message });
        return;
      }
      setSubjects(data || []);
    }
    fetchSubjects();
  }, []);

  // جلب بيانات المادة عند التعديل
  useEffect(() => {
    if (!id) return;
    async function fetchSubject() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          toast.error("فشل تحميل بيانات المادة", {
            description: error.message,
          });
          return;
        }
        if (data) {
          setSubject(data);
          setTitle(data.title);
          setEnglishTitle(data.english_title || "");
          setType(data.type);
          setParentId(data.parent_id || null);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const payload = {
      title,
      english_title: englishTitle || null,
      type,
      parent_id: parentId || null,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("subjects")
        .update(payload)
        .eq("id", subject!.id);
      error = result.error;
    } else {
      const result = await supabase.from("subjects").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} المادة`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} المادة بنجاح`);
    revalidate();
    navigate("/dashboard/subjects");
  };

  // قائمة المواد المستبعد منها المادة الحالية (لتجنب الإشارة الذاتية)
  const filteredSubjects = isEditing
    ? subjects.filter((s) => s.id !== subject?.id)
    : subjects;

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل مادة" : "إنشاء مادة جديدة"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اسم المادة عربي */}
          <div className="space-y-2">
            <Label htmlFor="title">الاسم العربي</Label>
            <Input
              id="title"
              placeholder="أدخل اسم المادة بالعربية"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* اسم المادة إنجليزي */}
          <div className="space-y-2">
            <Label htmlFor="english_title">الاسم الإنجليزي (اختياري)</Label>
            <Input
              id="english_title"
              placeholder="English name"
              value={englishTitle}
              onChange={(e) => setEnglishTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* النوع */}
          <div className="space-y-2">
            <Label htmlFor="type">النوع</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as Subject["type"])}
              required
              disabled={loading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="اختر نوع المادة" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* المادة الأم (اختياري) */}
          <div className="space-y-2">
            <Label htmlFor="parent">المادة الأم (اختياري)</Label>
            <Select
              value={parentId ?? "none"}
              onValueChange={(v) => setParentId(v === "none" ? null : v)}
              disabled={loading}
            >
              <SelectTrigger id="parent">
                <SelectValue placeholder="بدون مادة أم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون</SelectItem>
                {filteredSubjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {isEditing ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
                </>
              ) : (
                <>{isEditing ? "حفظ التغييرات" : "إنشاء المادة"}</>
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
