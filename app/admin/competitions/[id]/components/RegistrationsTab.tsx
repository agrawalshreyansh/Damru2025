"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";
import TeamRegistrationCard from "./TeamRegistrationCard";
import SoloRegistrationCard from "./SoloRegistrationCard";

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
  userId: string;
  competitionId: string;
  teamId?: string;
  paymentStatus: string;
  createdAt: string;
  user: {
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
  team?: RegistrationTeam;
}

interface RegistrationsTabProps {
  registrations: RegistrationData[];
  registrationsLoading: boolean;
  onApproveTeam: (teamId: string) => void;
  approvingTeam: string | null;
  formatDateOnly: (dateString: string) => string;
}

export default function RegistrationsTab({
  registrations,
  registrationsLoading,
  onApproveTeam,
  approvingTeam,
  formatDateOnly,
}: RegistrationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Registrations ({registrations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {registrationsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading registrations...</span>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Registrations Yet
            </h3>
            <p className="text-gray-600">
              No teams have registered for this competition yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => (
              <div key={registration.id}>
                {registration.team ? (
                  <TeamRegistrationCard
                    registration={
                      registration as RegistrationData & {
                        team: RegistrationTeam;
                      }
                    }
                    onApproveTeam={onApproveTeam}
                    approvingTeam={approvingTeam}
                    formatDateOnly={formatDateOnly}
                  />
                ) : (
                  <SoloRegistrationCard
                    registration={registration}
                    formatDateOnly={formatDateOnly}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
