"use client";
import React from "react";
import { Input } from "../ui/input";

const Search = () => {
  return (
    <>
      <div>
        <Input
          type="search"
          placeholder="Search..."
          className="md:w-[100px] text-black lg:w-[300px]"
        />
      </div>
    </>
  );
};

export default Search;
