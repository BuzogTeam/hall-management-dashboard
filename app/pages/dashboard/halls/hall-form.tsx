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
import { type Hall, HALL_TYPES, FLOOR_OPTIONS } from "~/lib/types";

// تعريف واجهة Building المطلوبة
export interface Building {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function HallForm() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [hall, setHall] = useState<Hall | null>(null);

  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [floor, setFloor] = useState("1");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [buildingsRes, hallRes] = await Promise.all([
          supabase.from("buildings").select("*"),
          id ? supabase.from("halls").select("*").eq("id", id).single() : null,
        ]);

        if (buildingsRes.error) {
          toast.error("Failed to load buildings", {
            description: buildingsRes.error.message,
          });
        } else {
          setBuildings(buildingsRes.data || []);
        }

        if (id && hallRes) {
          if (hallRes.error) {
            toast.error("Failed to load hall data", {
              description: hallRes.error.message,
            });
          } else if (hallRes.data) {
            const currentHall = hallRes.data;
            setHall(currentHall);
            setTitle(currentHall.title || "");
            setBuildingId(currentHall.building_id || "");
            setFloor(currentHall.floor || 1);
            setType(currentHall.type || "قاعة");
          }
        }
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const isEditing = !!id;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const navigator = useNavigate();
    const { revalidate } = useRevalidator();

    const data = {
      title,
      building_id: buildingId,
      floor,
      type,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from("halls")
        .update(data)
        .eq("id", hall!.id);
      error = result.error;
    } else {
      const result = await supabase.from("halls").insert(data);
      error = result.error;
    }

    if (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} hall`, {
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast.success(`Hall ${isEditing ? "updated" : "created"} successfully`);
    revalidate();
    navigator("/dashboard/halls");
  };

  return (
    <Card className="max-w-2xl m-6">
      <CardHeader>
        <CardTitle>{isEditing ? "تعديل قاعة" : "انشاء قاعة"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              placeholder="قاعة 101 ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">المبنى</Label>
            <Select
              value={buildingId ? String(buildingId) : undefined}
              onValueChange={(v) => {
                setBuildingId(v);
              }}
              required
            >
              <SelectTrigger id="building">
                <SelectValue placeholder="اختر المبنى" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Floor</Label>
            <Select
              value={floor}
              onValueChange={(v) => setFloor(v as Hall["floor"])}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={"اختر الطابق"} />
              </SelectTrigger>
              <SelectContent>
                {FLOOR_OPTIONS.map((floorOption) => (
                  <SelectItem key={floorOption.value} value={floorOption.value}>
                    {floorOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as Hall["type"])}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={"اختر نوع القاعة"} />
              </SelectTrigger>
              <SelectContent>
                {HALL_TYPES.map((hallType) => (
                  <SelectItem key={hallType.value} value={hallType.value}>
                    {hallType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !buildingId}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Save Changes" : "Create Hall"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
