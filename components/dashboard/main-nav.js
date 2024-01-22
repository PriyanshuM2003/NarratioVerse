"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const MainNav = ({ className }) => {
  return (
    <>
      <nav
        className={cn("flex items-center text-white space-x-4 lg:space-x-6", className)}
        //   {...props}
      >
        <Link
          href="/examples/dashboard"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Overview
        </Link>
        <Link
          href="/examples/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Customers
        </Link>
        <Link
          href="/examples/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Products
        </Link>
        <Link
          href="/examples/dashboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Settings
        </Link>
      </nav>
    </>
  );
};

export default MainNav;
