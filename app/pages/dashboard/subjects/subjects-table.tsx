// app/routes/dashboard/subjects/page.tsx أو المسار المناسب
import { EntityDataTable } from "~/components/entity-data-table";
import type { Subject } from "~/lib/types";

interface SubjectsTableProps {
  data: Subject[];
}

export function SubjectsTable({ data }: SubjectsTableProps) {
  return (
    <EntityDataTable<Subject>
      data={data}
      entityName="subjects"
      createHref="/dashboard/subjects/new"
      createLabel="إضافة مادة"
      titleAccessor="title"
      titleHeader="العنوان"
      titleCell={(subject) => (
        <div className="flex flex-col">
          <span className="font-medium">{subject.title}</span>
          {subject.english_title && (
            <span className="text-xs text-muted-foreground dir-ltr text-right">
              {subject.english_title}
            </span>
          )}
        </div>
      )}
      searchKey="title"
      searchPlaceholder="البحث عن مادة..."
      showCreatedAt={true}
      createdAtHeader="تاريخ الإنشاء"
      extraColumns={[
        {
          id: "type",
          accessorKey: "type",
          header: "النوع",
        },
        {
          id: "parent",
          header: "المادة الأساسية",
          cell: ({ row }) => {
            const parent = row.original.parent;
            return parent ? (
              <span className="text-sm bg-secondary px-2 py-1 rounded">
                {parent.title}
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            );
          },
        },
      ]}
    />
  );
}
