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
import { Checkbox } from "~/components/ui/checkbox"; // افترض وجود checkbox
import { createClient } from "~/lib/supabase/client";
import type { Lecture, Subject, Hall, Instructor, Batch } from "~/lib/types";

const DAYS_OF_WEEK = [
  { value: "السبت", label: "السبت" },
  { value: "الأحد", label: "الأحد" },
  { value: "الاثنين", label: "الاثنين" },
  { value: "الثلاثاء", label: "الثلاثاء" },
  { value: "الأربعاء", label: "الأربعاء" },
  { value: "الخميس", label: "الخميس" },
  { value: "الجمعة", label: "الجمعة" },
];

export default function LectureForm() {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // بيانات الخيارات من الجداول الأخرى
  const [subjects, setSubjects] = useState<any[]>([]);
  const [halls, setHalls] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  // الحقول
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startAt, setStartAt] = useState("08:00");
  const [endAt, setEndAt] = useState("09:00");
  const [subjectId, setSubjectId] = useState("");
  const [hallId, setHallId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [canceled, setCanceled] = useState(false);
  const [group, setGroup] = useState("");

  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // جلب قوائم الاختيارات
  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const [subjectsRes, hallsRes, instructorsRes, batchesRes] =
          await Promise.all([
            supabase.from("subjects").select("id, title"),
            supabase.from("halls").select("id, title"),
            supabase.from("instructors").select("id, name"),
            supabase.from("batches").select("id, department_abbr, level_id"), // ربما تحتاج عرض أكثر وضوحًا
          ]);

        if (subjectsRes.error)
          toast.error("فشل تحميل المواد", { description: subjectsRes.error.message });
        else setSubjects(subjectsRes.data || []);

        if (hallsRes.error)
          toast.error("فشل تحميل القاعات", { description: hallsRes.error.message });
        else setHalls(hallsRes.data || []);

        if (instructorsRes.error)
          toast.error("فشل تحميل الأساتذة", { description: instructorsRes.error.message });
        else setInstructors(instructorsRes.data || []);

        if (batchesRes.error)
          toast.error("فشل تحميل الدفعات", { description: batchesRes.error.message });
        else setBatches(batchesRes.data || []);
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);

  // جلب بيانات المحاضرة عند التعديل
  useEffect(() => {
    if (!id) return;
    async function fetchLecture() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("lectures")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          toast.error("فشل تحميل بيانات المحاضرة", { description: error.message });
          return;
        }
        if (data) {
          setLecture(data);
          setDayOfWeek(data.day_of_week);
          setStartAt(data.start_at);
          setEndAt(data.end_at);
          setSubjectId(data.subject_id || "");
          setHallId(data.hall_id || "");
          setInstructorId(data.instructor_id || "");
          setBatchId(data.batch_id || "");
          setCanceled(data.canceled || false);
          setGroup(data.group || "");
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLecture();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const payload = {
      day_of_week: dayOfWeek,
      start_at: startAt,
      end_at: endAt,
      subject_id: subjectId,
      hall_id: hallId,
      instructor_id: instructorId,
      batch_id: batchId,
      canceled,
      group: group || null,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("lectures")
        .update(payload)
        .eq("id", lecture!.id);
      error = result.error;
    } else {
      const result = await supabase.from("lectures").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} المحاضرة`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} المحاضرة بنجاح`);
    revalidate();
    navigate("/dashboard/lectures");
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>
          {isEditing ? "تعديل محاضرة" : "إنشاء محاضرة جديدة"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اليوم */}
          <div className="space-y-2">
            <Label htmlFor="day">اليوم</Label>
            <Select
              value={dayOfWeek}
              onValueChange={setDayOfWeek}
              required
              disabled={loading}
            >
              <SelectTrigger id="day">
                <SelectValue placeholder="اختر اليوم" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* وقت البداية والنهاية */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_at">وقت البداية</Label>
              <Input
                id="start_at"
                type="time"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_at">وقت النهاية</Label>
              <Input
                id="end_at"
                type="time"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* المادة */}
          <div className="space-y-2">
            <Label htmlFor="subject">المادة</Label>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
              required
              disabled={loading}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="اختر المادة" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* القاعة */}
          <div className="space-y-2">
            <Label htmlFor="hall">القاعة</Label>
            <Select
              value={hallId}
              onValueChange={setHallId}
              required
              disabled={loading}
            >
              <SelectTrigger id="hall">
                <SelectValue placeholder="اختر القاعة" />
              </SelectTrigger>
              <SelectContent>
                {halls.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الأستاذ */}
          <div className="space-y-2">
            <Label htmlFor="instructor">الأستاذ</Label>
            <Select
              value={instructorId}
              onValueChange={setInstructorId}
              required
              disabled={loading}
            >
              <SelectTrigger id="instructor">
                <SelectValue placeholder="اختر الأستاذ" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الدفعة */}
          <div className="space-y-2">
            <Label htmlFor="batch">الدفعة</Label>
            <Select
              value={batchId}
              onValueChange={setBatchId}
              required
              disabled={loading}
            >
              <SelectTrigger id="batch">
                <SelectValue placeholder="اختر الدفعة" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.department_abbr} - مستوى {b.level_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* المجموعة (اختياري) */}
          <div className="space-y-2">
            <Label htmlFor="group">المجموعة (اختياري)</Label>
            <Input
              id="group"
              placeholder="مثال: A"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* مُلغاة */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="canceled"
              checked={canceled}
              onCheckedChange={(checked) => setCanceled(Boolean(checked))}
              disabled={loading}
            />
            <Label htmlFor="canceled" className="cursor-pointer">
              محاضرة ملغاة
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={
                loading ||
                !dayOfWeek ||
                !startAt ||
                !endAt ||
                !subjectId ||
                !hallId ||
                !instructorId ||
                !batchId
              }
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {isEditing ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
                </>
              ) : (
                <>{isEditing ? "حفظ التغييرات" : "إنشاء المحاضرة"}</>
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