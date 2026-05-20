"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit2 } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";
import { DAYS_OF_WEEK, type Lecture } from "~/lib/types";

const formatTime = (timeStr: string) => timeStr.slice(0, 5);

const columns: ColumnDef<Lecture>[] = [
  {
    id: "subject",
    header: "المادة",
    cell: ({ row }) => {
      const lecture = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {lecture.subject?.title || "مادة غير معروفة"}
          </span>
          {lecture.group && (
            <span className="text-xs text-muted-foreground">
              مجموعة: {lecture.group}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "timing",
    header: "التوقيت",
    cell: ({ row }) => {
      const { day_of_week, start_at, end_at } = row.original;
      const dayName = DAYS_OF_WEEK[day_of_week] || "غير محدد";
      return (
        <div className="flex flex-col text-sm">
          <span className="font-medium">{dayName}</span>
          <span className="text-xs text-muted-foreground dir-ltr text-right">
            {formatTime(start_at)} - {formatTime(end_at)}
          </span>
        </div>
      );
    },
  },
  {
    id: "instructor",
    header: "المحاضر",
    cell: ({ row }) => row.original.instructor?.name || "—",
  },
  {
    id: "hall",
    header: "القاعة",
    cell: ({ row }) => row.original.hall?.title || "—",
  },
  {
    id: "batch",
    header: "الدفعة",
    cell: ({ row }) => row.original.batch?.department_abbr|| "—",
  },
  {
    accessorKey: "canceled",
    header: "الحالة",
    cell: ({ row }) => {
      const isCanceled = row.original.canceled;
      return isCanceled ? (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
          ملغاة
        </span>
      ) : (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
          مستمرة
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lecture = row.original;
      const itemName = `${lecture.subject?.title || "محاضرة"} - ${DAYS_OF_WEEK[lecture.day_of_week] || ""}`;

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/lectures/${lecture.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">تعديل</span>
            </Link>
          </Button>
          <DeleteDialog id={lecture.id} table="lectures" itemName={itemName} />
        </div>
      );
    },
  },
];

interface LecturesTableProps {
  data: Lecture[];
}

export function LecturesTable({ data }: LecturesTableProps) {
  return (
    <EntityTable
      columns={columns}
      data={data}
      searchKey="group"
      searchPlaceholder="البحث برقم المجموعه..."
      createHref="/dashboard/lectures/new"
      createLabel="إضافة محاضرة"
    />
  );
}
