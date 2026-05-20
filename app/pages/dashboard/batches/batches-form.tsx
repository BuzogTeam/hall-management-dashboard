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
import type { Batch, Department, Level } from "~/lib/types";

export default function BatchForm() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const { id } = useParams<{ id: string }>();

  const [departmentId, setDepartmentId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [deptAbbr, setDeptAbbr] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const isEditing = !!id;

  // تحميل الأقسام والمستويات مرة واحدة
  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const [deptRes, levelRes] = await Promise.all([
          supabase.from("departments").select("*"),
          supabase.from("levels").select("*"),
        ]);

        if (deptRes.error) {
          toast.error("فشل تحميل الأقسام", {
            description: deptRes.error.message,
          });
        } else {
          setDepartments(deptRes.data || []);
        }

        if (levelRes.error) {
          toast.error("فشل تحميل المستويات", {
            description: levelRes.error.message,
          });
        } else {
          setLevels(levelRes.data || []);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);

  // تحميل بيانات الدفعة عند التعديل
  useEffect(() => {
    if (!id) return;
    async function fetchBatch() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("فشل تحميل بيانات الدفعة", {
            description: error.message,
          });
        } else if (data) {
          setBatch(data);
          setDepartmentId(data.department_id || "");
          setLevelId(data.level_id || "");
          setDeptAbbr(data.department_abbr || "");
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBatch();
  }, [id]);

  // عند تغيير القسم، تحديث الاختصار تلقائياً
  useEffect(() => {
    if (departmentId && departments.length > 0) {
      const selectedDept = departments.find((d) => d.id === departmentId);
      setDeptAbbr(selectedDept?.abbreviation || "");
    } else {
      setDeptAbbr(""); // إذا لم يُختر قسم
    }
  }, [departmentId, departments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();

    const payload = {
      department_id: departmentId,
      level_id: levelId,
      department_abbr: deptAbbr,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("batches")
        .update(payload)
        .eq("id", batch!.id);
      error = result.error;
    } else {
      const result = await supabase.from("batches").insert(payload);
      error = result.error;
    }

    if (error) {
      toast.error(`فشل ${isEditing ? "تعديل" : "إنشاء"} الدفعة`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`تم ${isEditing ? "تعديل" : "إنشاء"} الدفعة بنجاح`);
    revalidate();
    navigate("/dashboard/batches");
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل دفعة" : "إنشاء دفعة جديدة"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* القسم */}
          <div className="space-y-2">
            <Label htmlFor="department">القسم</Label>
            <Select
              value={departmentId}
              onValueChange={setDepartmentId}
              required
              disabled={loading}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* المستوى */}
          <div className="space-y-2">
            <Label htmlFor="level">المستوى الدراسي</Label>
            <Select
              value={levelId}
              onValueChange={setLevelId}
              required
              disabled={loading}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="اختر المستوى" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((lvl) => (
                  <SelectItem key={lvl.id} value={lvl.id}>
                    {lvl.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* اختصار القسم (تلقائي) */}
          <div className="space-y-2">
            <Label htmlFor="deptAbbr">اختصار القسم</Label>
            <Input
              id="deptAbbr"
              placeholder="سيُملأ تلقائياً"
              value={deptAbbr}
              onChange={(e) => setDeptAbbr(e.target.value)} // يمكن التعديل يدوياً إذا رغبت
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              يظهر تلقائياً بناءً على القسم المختار
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={
                loading || !departmentId || !levelId || !deptAbbr.trim()
              }
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {isEditing ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
                </>
              ) : (
                <>{isEditing ? "حفظ التغييرات" : "إنشاء الدفعة"}</>
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
