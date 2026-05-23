// app/components/entity-data-table.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, SortAscIcon } from "lucide-react";
import { Link } from "react-router";
import { DeleteDialog } from "~/components/delete-dialog";
import { EntityTable } from "~/components/entity-table";
import { Button } from "~/components/ui/button";

// مكون مساعد لعرض رأس العمود مع زر الترتيب
function SortableHeader({ column, label }: { column: any; label: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <SortAscIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}

interface EntityDataTableProps<TData extends { id: string | number }> {
  data: TData[];
  entityName: string;
  createHref: string;
  createLabel?: string;
  titleAccessor?: string;
  titleHeader?: string;
  titleCell?: (row: TData) => React.ReactNode;
  showCreatedAt?: boolean;
  createdAtHeader?: string;
  extraColumns?: ColumnDef<TData>[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function EntityDataTable<TData extends { id: string | number }>({
  data,
  entityName,
  createHref,
  createLabel,
  titleAccessor = "title",
  titleHeader = "العنوان",
  titleCell,
  showCreatedAt = false,
  createdAtHeader = "تاريخ الإضافة",
  extraColumns = [],
  searchKey,
  searchPlaceholder,
}: EntityDataTableProps<TData>) {
  const columns: ColumnDef<TData>[] = [
    {
      id: titleAccessor || "title",
      accessorKey: titleAccessor || undefined,
      header: ({ column }) => (
        <SortableHeader column={column} label={titleHeader} />
      ),
      cell: titleCell
        ? ({ row }) => titleCell(row.original)
        : titleAccessor
          ? ({ row }) =>
              String(row.original[titleAccessor as keyof TData] ?? "")
          : ({ row }) => null,
    },
  ];

  // إضافة الأعمدة الإضافية قبل تاريخ الإنشاء
  extraColumns.forEach((col) => {
    if (col.id === "actions") {
      columns.push(col);
      return;
    }

    const newCol: ColumnDef<TData> = { ...col };

    // إذا كان الرأس نصياً، نحوله إلى مكون SortableHeader مع الحفاظ على id
    if (typeof col.header === "string") {
      const label = col.header as string;
      // إذا لم يكن للعمود id، نشتقه من accessorKey أو header
      if (!newCol.id && col.accessorKey) {
        newCol.id = col.accessorKey as string;
      } else if (!newCol.id) {
        newCol.id = label.toLowerCase().replace(/\s+/g, "_");
      }
      newCol.header = ({ column }) => (
        <SortableHeader column={column} label={label} />
      );
    }

    columns.push(newCol);
  });

  // إضافة عمود تاريخ الإنشاء مع دعم الترتيب
  if (showCreatedAt) {
    columns.push({
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <SortableHeader column={column} label={createdAtHeader} />
      ),
      cell: ({ row }) => {
        const date = new Date((row.original as any).created_at);
        return date.toLocaleDateString("ar-YE");
      },
    });
  }

  // عمود الإجراءات (تعديل + حذف)
  columns.push({
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/dashboard/${entityName}/${item.id}/edit`}>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">تعديل</span>
            </Link>
          </Button>
          <DeleteDialog
            id={item.id as string}
            table={entityName}
            itemName={(item as any)[titleAccessor] ?? ""}
          />
        </div>
      );
    },
  });

  return (
    <EntityTable
      columns={columns}
      data={data}
      createHref={createHref}
      createLabel={createLabel}
      searchKey={searchKey}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
