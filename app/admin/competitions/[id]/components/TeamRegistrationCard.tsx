"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, Phone, School, CheckCircle, Loader2, Eye } from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";

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
    yearOfStudy?: string;
    state?: string;
    city?: string;
    gender?: string;
    collegeIdPic?: string;
    govtIdPic?: string;
  };
}

interface RegistrationTeam {
  id: string;
  name: string;
  paymentStatus: string;
  leader: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    collegeName?: string;
    yearOfStudy?: string;
    state?: string;
    city?: string;
    gender?: string;
    collegeIdPic?: string;
    govtIdPic?: string;
  };
  members: TeamMember[];
}

interface RegistrationData {
  id: string;
  createdAt: string;
  team: RegistrationTeam;
}

interface TeamRegistrationCardProps {
  registration: RegistrationData;
  onApproveTeam: (teamId: string) => void;
  approvingTeam: string | null;
  formatDateOnly: (dateString: string) => string;
}

export default function TeamRegistrationCard({
  registration,
  onApproveTeam,
  approvingTeam,
  formatDateOnly,
}: TeamRegistrationCardProps) {
  const { team } = registration;

  const UserCard = ({
    user,
    role,
    status,
    isClickable = true,
  }: {
    user: any;
    role: "leader" | "member";
    status?: string;
    isClickable?: boolean;
  }) => {
    const cardContent = (
      <div
        className={`${
          role === "leader"
            ? "bg-blue-50 border border-blue-200"
            : "bg-gray-50 border border-gray-200"
        } rounded-lg p-4 ${
          isClickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p
                className={`font-medium ${
                  role === "leader" ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {user.name}
              </p>
              {isClickable && <Eye className="h-4 w-4 text-gray-400" />}
            </div>
            <div
              className={`space-y-1 text-sm ${
                role === "leader" ? "text-blue-700" : "text-gray-600"
              } mt-2`}
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              )}
              {user.collegeName && (
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  {user.collegeName}
                </div>
              )}
            </div>
          </div>
          {status && (
            <Badge
              variant={
                status === "ACCEPTED"
                  ? "default"
                  : status === "PENDING"
                  ? "secondary"
                  : "outline"
              }
            >
              {status}
            </Badge>
          )}
        </div>
      </div>
    );

    if (!isClickable) {
      return cardContent;
    }

    return (
      <UserDetailsModal
        user={user}
        userRole={role}
        memberStatus={status}
        trigger={cardContent}
      />
    );
  };

  return (
    <Card className="border rounded-lg p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
            <p className="text-sm text-gray-600">
              Registered on {formatDateOnly(registration.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                team.paymentStatus === "APPROVED"
                  ? "secondary"
                  : team.paymentStatus === "COMPLETED"
                  ? "default"
                  : "outline"
              }
            >
              {team.paymentStatus === "PENDING" && "Pending Review"}
              {team.paymentStatus === "APPROVED" && "Payment Due"}
              {team.paymentStatus === "COMPLETED" && "Completed"}
            </Badge>
            {team.paymentStatus === "PENDING" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" disabled={approvingTeam === team.id}>
                    {approvingTeam === team.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Team
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Approve Team Registration?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve team "{team.name}"? This
                      will send a payment notification email to the team leader
                      and change the status to "Payment Due".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onApproveTeam(team.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Yes, Approve Team
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Team Leader */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Team Leader</h4>
          <UserCard user={team.leader} role="leader" />
        </div>

        {/* Team Members */}
        {team.members.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Team Members ({team.members.length})
            </h4>
            <div className="space-y-3">
              {team.members.map((member) => (
                <UserCard
                  key={member.id}
                  user={member.user || member}
                  role="member"
                  status={member.status}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
