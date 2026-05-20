import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("auth", "pages/login/page.tsx"),
  route("dashboard", "pages/dashboard/layout.tsx", [
    index("pages/dashboard/main/page.tsx"),
    route("departments", "pages/dashboard/departments/page.tsx"),
    route("buildings", "pages/dashboard/buildings/page.tsx"),
    route("batches", "pages/dashboard/batches/page.tsx"),
    route("halls", "pages/dashboard/halls/page.tsx"),
    route("levels", "pages/dashboard/levels/page.tsx"),
    route("instructors", "pages/dashboard/instructors/page.tsx"),
    route("subjects", "pages/dashboard/subjects/page.tsx"),
    route("lectures", "pages/dashboard/lectures/page.tsx"),


    route("halls/new", "pages/dashboard/halls/hall-form.tsx", {
      id: "hall-create",
    }),
    route("halls/:id/edit", "pages/dashboard/halls/hall-form.tsx", {
      id: "hall-edit",
    }),

    route("buildings/new", "pages/dashboard/buildings/buildings-form.tsx", {
      id: "building-create",
    }),
    route("buildings/:id/edit", "pages/dashboard/buildings/buildings-form.tsx", {
      id: "building-edit",
    }),

    route("departments/new", "pages/dashboard/departments/departments-form.tsx", {
      id: "department-create",
    }),
    route("departments/:id/edit", "pages/dashboard/departments/departments-form.tsx", {
      id: "department-edit",
    }),

    // need review
    route("batches/new", "pages/dashboard/batches/batches-form.tsx", {
      id: "batch-create",
    }),
    route("batches/:id/edit", "pages/dashboard/batches/batches-form.tsx", {
      id: "batch-edit",
    }),

    route("levels/new", "pages/dashboard/levels/levels-form.tsx", {
      id: "level-create",
    }),
    route("levels/:id/edit", "pages/dashboard/levels/levels-form.tsx", {
      id: "level-edit",
    }),

    route("instructors/new", "pages/dashboard/instructors/instructors-form.tsx", {
      id: "instructor-create",
    }),
    route("instructors/:id/edit", "pages/dashboard/instructors/instructors-form.tsx", {
      id: "instructor-edit",
    }),

    route("subjects/new", "pages/dashboard/subjects/subjects-form.tsx", {
      id: "subject-create",
    }),
    route("subjects/:id/edit", "pages/dashboard/subjects/subjects-form.tsx", {
      id: "subject-edit",
    }),

    route("lectures/new", "pages/dashboard/lectures/lectures-form.tsx", {
      id: "lecture-create",
    }),
    route("lectures/:id/edit", "pages/dashboard/lectures/lectures-form.tsx", {
      id: "lecture-edit",
    }),
  ]),
] satisfies RouteConfig;
