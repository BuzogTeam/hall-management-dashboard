"use client";

import { ResourceForm, type FieldValue, type ResourceFormConfig } from "~/components/resource-form";
import { createClient } from "~/lib/supabase/client";
import {
  FLOOR_OPTIONS,
  HALL_TYPES,
  type Hall,
} from "~/lib/types";

interface HallValues {
  [key: string]: FieldValue;
  title: string;
  building_id: string;
  floor: string;
  type: string;
}

const hallFormConfig: ResourceFormConfig<HallValues, Hall> = {
  resourceLabel: "قاعة",
  tableName: "halls",
  redirectPath: "/dashboard/halls",
  defaultValues: {
    title: "",
    building_id: "",
    floor: "1",
    type: "",
  },
  fields: [
    {
      name: "title",
      label: "اسم القاعة",
      type: "text",
      placeholder: "قاعة 101 ...",
      required: true,
      span: "full",
    },
    {
      name: "building_id",
      label: "المبنى",
      type: "select",
      placeholder: "اختر المبنى",
      required: true,
      span: "half",
      loadOptions: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("buildings")
          .select("id, title")
          .order("title");
        if (error) throw error;
        return (data ?? []).map((b) => ({
          value: String(b.id),
          label: b.title,
        }));
      },
    },
    {
      name: "floor",
      label: "الطابق",
      type: "select",
      placeholder: "اختر الطابق",
      required: true,
      span: "half",
      options: FLOOR_OPTIONS.map((o) => ({
        value: String(o.value),
        label: o.label,
      })),
    },
    {
      name: "type",
      label: "نوع القاعة",
      type: "select",
      placeholder: "اختر نوع القاعة",
      required: true,
      span: "full",
      options: HALL_TYPES.map((t) => ({
        value: t.value,
        label: t.label,
      })),
    },
  ],
  toFormValues: (h) => ({
    title: h.title ?? "",
    building_id: h.building_id ? String(h.building_id) : "",
    floor: h.floor !== null && h.floor !== undefined ? String(h.floor) : "1",
    type: h.type ?? "",
  }),
  toPayload: (v, mode) => ({
    title: v.title,
    building_id: v.building_id,
    floor: Number(v.floor),
    type: v.type,
    ...(mode === "update" ? { updated_at: new Date().toISOString() } : {}),
  }),
};

export default function HallForm() {
  return <ResourceForm config={hallFormConfig} />;
}
