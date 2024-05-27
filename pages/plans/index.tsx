"use client";
import React, { useEffect, useState } from "react";
import { plans } from "@/data/plans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadStripe } from "@stripe/stripe-js";
import GetLoggedUserData from "@/routes/getLoggedUserData";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/router";
import GetUserPlanData from "@/routes/getPlanData";

const Plans: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("premium");
  const [planData, setPlanData] = useState<any>("");
  const { loggedUserData, loadingUserData } = GetLoggedUserData();
  const { loadingUserPlanData, userPlanData } = GetUserPlanData();
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (userPlanData) {
      setPlanData(userPlanData);
    }
  }, [userPlanData]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const currentPlans =
    selectedTab === "premium" ? plans.premium : plans.creator;

  const handleCheckout = async (
    price: number,
    category: string,
    title: string
  ) => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
    );
    if (!stripe) {
      return;
    }
    const stripeSignature = "stripe-signature";

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "stripe-signature": stripeSignature,
          },
          body: JSON.stringify({ price, category, title }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }

      const responseData = await response.json();
      console.log(responseData);
      if (response.url) {
        window.location.replace(responseData.url);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  return (
    <>
      <div className="text-white min-h-screen body-font p-6 overflow-hidden">
        {loadingUserData ? (
          <Skeleton className="h-[500px] w-[300px] flex items-center mx-auto mt-20" />
        ) : (
          <>
            {loggedUserData?.creator && loggedUserData.creator ? (
              <div className="flex items-center justify-center mt-10">
                {plans.creator.map((plan: any, index: number) => (
                  <div key={index}>
                    {planData.type === plan.title && (
                      <div className="h-full w-[500px] p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
                        <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                          {plan.title}
                        </h2>
                        <h1 className="text-5xl text-white pb-4 mb-4 border-b border-gray-200 leading-none">
                          ₹{plan.price} Paid
                        </h1>
                        {plan.features.map(
                          (feature: string, featIndex: number) => (
                            <p
                              key={featIndex}
                              className="flex items-center text-white mb-2"
                            >
                              <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-900 text-white rounded-full flex-shrink-0">
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </span>
                              {feature}
                            </p>
                          )
                        )}
                        <div className="flex items-center justify-center font-semibold mt-auto text-white bg-gray-900 border-0 py-2 px-4 w-full rounded">
                          Your Plan Expires on:&nbsp;
                          {planData.expiryDate
                            ? new Date(planData.expiryDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : planData.premium && plans.premium ? (
              <div className="flex items-center justify-center mt-10">
                {plans.premium.map((plan: any, index: number) => (
                  <div key={index}>
                    {planData.type === plan.title && (
                      <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
                        <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                          {plan.title}
                        </h2>
                        <h1 className="text-5xl text-white pb-4 mb-4 border-b border-gray-200 leading-none">
                          ₹{plan.price} Paid
                        </h1>
                        {plan.features.map(
                          (feature: string, featIndex: number) => (
                            <p
                              key={featIndex}
                              className="flex items-center text-white mb-2"
                            >
                              <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-900 text-white rounded-full flex-shrink-0">
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2.5"
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </span>
                              {feature}
                            </p>
                          )
                        )}
                        <div className="flex items-center justify-center font-semibold mt-auto text-white bg-gray-900 border-0 py-2 px-4 w-full rounded">
                          Your Plan Expires on:&nbsp;
                          {planData.expiryDate
                            ? new Date(planData.expiryDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Tabs defaultValue="premium" className="h-full space-y-6">
                <div className="flex flex-col text-center w-full mb-20">
                  <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2">
                    Pricing
                  </h1>
                  <TabsContent value="premium">
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-400">
                      &quot;Experience seamless audio access and essentials with
                      our premium Plan – perfect for enjoying podcasts and
                      audiobooks hassle-free.&quot;
                    </p>
                  </TabsContent>
                  <TabsContent value="creator">
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-400">
                      &quot;Empower your audio storytelling with our Creator Pro
                      plan – designed for podcasters and audiobook creators
                      seeking limitless potential.&quot;
                    </p>
                  </TabsContent>
                  <div className="mt-4">
                    <TabsList className="bg-gray-950 border-2 text-white">
                      <TabsTrigger
                        value="premium"
                        onClick={() => handleTabChange("premium")}
                        className={`relative ${
                          selectedTab === "premium" ? "active" : ""
                        }`}
                      >
                        Premium
                      </TabsTrigger>
                      <TabsTrigger
                        value="creator"
                        onClick={() => handleTabChange("creator")}
                        className={`relative ${
                          selectedTab === "creator" ? "active" : ""
                        }`}
                      >
                        Creator
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                <TabsContent value="premium">
                  <div className="grid grid-cols-3 w-full gap-2">
                    {currentPlans.map((plan: any, index: number) => (
                      <div key={index}>
                        <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
                          <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                            {plan.title}
                          </h2>
                          <h1 className="text-5xl text-white pb-4 mb-4 border-b border-gray-200 leading-none">
                            ₹{plan.price}
                          </h1>
                          {plan.features.map(
                            (feature: string, featIndex: number) => (
                              <p
                                key={featIndex}
                                className="flex items-center text-white mb-2"
                              >
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-900 text-white rounded-full flex-shrink-0">
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    className="w-3 h-3"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20 6L9 17l-5-5"></path>
                                  </svg>
                                </span>
                                {feature}
                              </p>
                            )
                          )}
                          <button
                            onClick={() =>
                              handleCheckout(
                                plan.price,
                                selectedTab,
                                plan.title
                              )
                            }
                            className="flex items-center font-semibold mt-auto text-white bg-gray-900 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded"
                          >
                            Buy Plan
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="w-4 h-4 ml-auto"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="creator">
                  <div className="grid grid-cols-3 w-full gap-2">
                    {currentPlans.map((plan: any, index: number) => (
                      <div key={index}>
                        <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
                          <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
                            {plan.title}
                          </h2>
                          <h1 className="text-5xl text-white pb-4 mb-4 border-b border-gray-200 leading-none">
                            ₹{plan.price}
                          </h1>
                          {plan.features.map(
                            (feature: string, featIndex: number) => (
                              <p
                                key={featIndex}
                                className="flex items-center text-white mb-2"
                              >
                                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-900 text-white rounded-full flex-shrink-0">
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    className="w-3 h-3"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20 6L9 17l-5-5"></path>
                                  </svg>
                                </span>
                                {feature}
                              </p>
                            )
                          )}
                          <button
                            onClick={() =>
                              handleCheckout(
                                plan.price,
                                selectedTab,
                                plan.title
                              )
                            }
                            className="flex items-center font-semibold mt-auto text-white bg-gray-900 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded"
                          >
                            Buy Plan
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              className="w-4 h-4 ml-auto"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Plans;
