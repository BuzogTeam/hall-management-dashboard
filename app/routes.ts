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
    ]),
] satisfies RouteConfig;
