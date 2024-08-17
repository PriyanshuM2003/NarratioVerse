import Link from "next/link";
import React from "react";
interface VerificationMailProps {
  token: string;
}
export const VerificationMail: React.FC<VerificationMailProps> = ({
  token,
}) => {
  return (
    <>
      <body
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#f7fafc",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#2d3748",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#ffffff" }}>Narratioverse</span>
          </h1>
          <p
            style={{ fontSize: "18px", color: "#ffffff", textAlign: "center" }}
          >
            <strong>Welcome to Narratioverse!</strong> <br />
            Thank you for registering with us.
          </p>
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_HOST}/verify?token=${token}`}
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px auto",
            }}
          >
            <button
              style={{
                height: "40px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "8px",
                paddingBottom: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
                backgroundColor: "#0e162d",
                color: "#ffffff",
                outline: "none",
                boxShadow: "0 0 0 2px transparent",
                cursor: "pointer",
              }}
            >
              Verify
            </button>
          </Link>
          <p
            style={{
              marginTop: "32px",
              fontSize: "14px",
              color: "#a0aec0",
              textAlign: "center",
            }}
          >
            If you didn't create an account with us, you can ignore this
            message.
          </p>

          <p
            style={{
              marginTop: "16px",
              fontSize: "14px",
              color: "#a0aec0",
              textAlign: "center",
            }}
          >
            Best Regards,
            <br />
            NARRATIOVERSE Team
          </p>
        </div>
      </body>
    </>
  );
};
