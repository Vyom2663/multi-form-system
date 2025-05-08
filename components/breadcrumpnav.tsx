"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routes: {
  [key: string]: { title: string; parent?: string };
} = {
  "/": { title: "Dashboard" },
  "/dashboard": { title: "Dashboard" },
  "/forms/category1/form1": {
    title: "Basic Details",
    parent: "Personal Information",
  },
  "/forms/category1/form2": {
    title: "Additional Details",
    parent: "Personal Information",
  },
  "/forms/category1/form3": {
    title: "Professional Details",
    parent: "Personal Information",
  },
  "/forms/category2/form1": {
    title: "Phone & Address",
    parent: "Contact Information",
  },
  "/forms/category2/form2": {
    title: "Additional Contacts",
    parent: "Contact Information",
  },
  "/forms/category3/form1": {
    title: "Communication Preferences",
    parent: "Preferences",
  },
  "/forms/category3/form2": {
    title: "Terms & Interests",
    parent: "Preferences",
  },
  "/completion": { title: "Completion" },
};

// Function to fetch route metadata safely
function getPageTitle(path: string) {
  return routes[path] || { title: "Unknown Page" };
}

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const route = getPageTitle(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {route.parent && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{route.parent}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{route.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
