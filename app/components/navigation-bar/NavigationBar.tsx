"use client";

import React from "react";
import Link from "next/link";
import { betterAuthClient } from "@/app/lib/integration/better-auth";

const NavigationBar = () => {
  const { data } = betterAuthClient.useSession();
  const navItems = [
    { label: "new", href: "/new" },
    { label: "past", href: "/past" },
    { label: "comments", href: "/comments" },
    { label: "ask", href: "/ask" },
    { label: "show", href: "/show" },
    { label: "jobs", href: "/jobs" },
    { label: "submit", href: "/submit" },
  ];
  return (
    <nav className="bg-orange-500 text-black text-1xl font-sans max-w-screen-lg mx-auto  mt-4 w-full">
      <div className="w-full flex items-center justify-between px-3 py-1">
        <div className="flex items-center flex-wrap gap-2">
          <Link href="/" className="font-bold text-black">
            Hacker News
          </Link>
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              <span className="text-black">|</span>
              <Link href={item.href}>{item.label}</Link>
            </React.Fragment>
          ))}
        </div>{" "}
        <div className="flex items-center gap-2">
          {data?.user ? (
            <button
              onClick={() => betterAuthClient.signOut()}
              className="hover:underline"
            >
              logout
            </button>
          ) : (
            <Link href="/login" className="hover:underline">
              login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
export default NavigationBar;
