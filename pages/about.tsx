"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const AboutUs = () => {
  return (
    <>
      <div className="bg-gray-900 text-white border-t-2">
        <div className="container flex flex-wrap items-center justify-center px-0 py-2 mx-auto lg:justify-between">
          <div className="flex flex-wrap justify-center">
            <ul className="flex max-md:flex-col justify-center items-center md:space-x-4">
              <li>
                <Link className="hover:text-pink-600" href="#">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-600" href="#">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-600" href="#">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link className="hover:text-pink-600" href="#">
                  Privacy Policy
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
              <svg
                className="h-5 w-5 fill-current"
                height="23"
                viewBox="0 0 1200 1227"
                width="23"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
              </svg>
            </Link>
            <Link href="#" className="hover:text-pink-600">
              <Instagram />
            </Link>
            <Link href="#" className="hover:text-pink-600">
              <Linkedin />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
