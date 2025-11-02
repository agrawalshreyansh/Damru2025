"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail, Users } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-redirect after countdown
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </CardTitle>
          <p className="text-lg text-gray-600">
            Your registration is now complete
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Registration Confirmed!
                </h3>
                <p className="text-green-800">
                  Congratulations! Your team&apos;s payment has been processed
                  successfully. All team members will receive confirmation
                  emails shortly with detailed information about the
                  competition.
                </p>
              </div>
            </div>
          </div>

          {/* Team Information */}
          {teamId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Team Registration Complete
                  </h3>
                  <p className="text-blue-800 text-sm mb-2">
                    Team ID:{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                      {teamId}
                    </code>
                  </p>
                  <p className="text-blue-800">
                    Your entire team is now registered and ready to compete in
                    Damru Fest 2025!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  What&apos;s Next?
                </h3>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Check your email for confirmation and team details</li>
                  <li>
                    • Keep an eye out for competition schedules and updates
                  </li>
                  <li>• Start preparing with your team members</li>
                  <li>• Contact us if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>
              You will be automatically redirected to the homepage in{" "}
              <span className="font-semibold text-blue-600">{countdown}</span>{" "}
              seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
