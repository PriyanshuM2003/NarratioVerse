"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white border-t-2">
        <div className="container flex flex-wrap items-center justify-center px-0 py-2 mx-auto lg:justify-between">
          <div className="flex flex-wrap justify-center">
            <ul className="flex items-center space-x-4">
              <li>
                <Link className="hover:text-pink-600" href={"/"}>
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-600" href={"/"}>
                  Contact US
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-600" href={"/"}>
                  Terms & Condition
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-center font-semibold">
              @2024 All rights reserved by Narratioverse.
            </p>
          </div>
          <div className="flex justify-center space-x-4 mt-4 lg:mt-0">
            <Link href="#" className="hover:text-pink-600">
              <Facebook />
            </Link>
            <Link href="#" className="hover:text-pink-600">
              <X size={28} />
            </Link>
            <Link href="#" className="hover:text-pink-600">
              <Instagram />
            </Link>
            <Link href="#" className="hover:text-pink-600">
              <Linkedin />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
