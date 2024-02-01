const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pluspng.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "supabase.co",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
