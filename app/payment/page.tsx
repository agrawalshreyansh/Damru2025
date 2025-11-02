"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Loader2,
  CreditCard,
  AlertCircle,
  Users,
  Mail,
  Phone,
  School,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  status: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    collegeName?: string;
  };
}

interface Team {
  id: string;
  name: string;
  paymentStatus: string;
  leader: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    collegeName?: string;
  };
  members: TeamMember[];
  competition: {
    id: string;
    title: string;
    registrationFee?: number;
  };
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const action = searchParams.get("action");

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      // This would need a new endpoint to get team details by ID
      // For now, I'll simulate the response
      const mockTeam: Team = {
        id: teamId || "",
        name: "Sample Team",
        paymentStatus: "APPROVED",
        leader: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+91 9876543210",
          collegeName: "Sample College",
        },
        members: [],
        competition: {
          id: "comp1",
          title: "Sample Competition",
          registrationFee: 500,
        },
      };
      setTeam(mockTeam);
    } catch (error: any) {
      setError("Failed to fetch team details");
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompletion = async () => {
    if (!teamId) return;

    try {
      setProcessing(true);
      const response = await axiosInstance.get(`/registeration/pay/${teamId}`);

      if (response.data?.data?.redirectUrl) {
        window.location.href = response.data.data.redirectUrl;
        return;
      }

      setSuccess(true);
    } catch (error: any) {
      console.error("Error completing payment:", error);
      setError(error.response?.data?.error || "Failed to complete payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading payment details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-4" />
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-green-600">
              <CheckCircle className="h-8 w-8 mx-auto mb-4" />
              <p className="font-semibold">Payment Completed!</p>
              <p className="text-sm mt-2">
                Registration emails have been sent to all team members.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Complete Payment - Damru Fest 2025
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {team && (
            <>
              {/* Team Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Team Name:</strong> {team.name}
                  </p>
                  <p>
                    <strong>Competition:</strong> {team.competition.title}
                  </p>
                  <p>
                    <strong>Registration Fee:</strong> ₹
                    {team.competition.registrationFee || 0}
                  </p>
                  <p>
                    <strong>Team Leader:</strong> {team.leader.name}
                  </p>
                  <p>
                    <strong>Total Members:</strong> {team.members.length + 1}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Payment Status
                    </h3>
                    <p className="text-yellow-800 text-sm">
                      Your team has been approved and is ready for payment
                      completion.
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {team.paymentStatus === "APPROVED"
                      ? "Payment Due"
                      : team.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              {team.paymentStatus === "APPROVED" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">
                    Ready to Complete Payment?
                  </h3>
                  <p className="text-green-800 text-sm mb-4">
                    Click the button below to automatically complete your
                    payment and send confirmation emails to all team members.
                    This is a demo system, so no actual payment will be
                    processed.
                  </p>

                  <Button
                    onClick={handlePaymentCompletion}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Complete Payment (₹
                        {team.competition.registrationFee || 0})
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-green-600 mt-2 text-center">
                    This will automatically approve your registration and send
                    emails to all team members
                  </p>
                </div>
              )}

              {team.paymentStatus === "COMPLETED" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-900">
                    Payment Already Completed!
                  </h3>
                  <p className="text-green-800 text-sm">
                    Your team registration is complete. All team members should
                    have received confirmation emails.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
