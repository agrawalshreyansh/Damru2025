"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, School, MapPin, Eye } from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";

interface SoloUser {
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
}

interface SoloRegistrationData {
  id: string;
  paymentStatus: string;
  createdAt: string;
  user: SoloUser;
}

interface SoloRegistrationCardProps {
  registration: SoloRegistrationData;
  formatDateOnly: (dateString: string) => string;
}

export default function SoloRegistrationCard({
  registration,
  formatDateOnly,
}: SoloRegistrationCardProps) {
  const userCardContent = (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <p className="font-medium text-gray-900">{registration.user.name}</p>
        <Eye className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-1 text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {registration.user.email}
        </div>
        {registration.user.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {registration.user.phone}
          </div>
        )}
        {registration.user.collegeName && (
          <div className="flex items-center gap-2">
            <School className="h-4 w-4" />
            {registration.user.collegeName}
          </div>
        )}
        {registration.user.yearOfStudy && (
          <div className="text-gray-600">
            Year: {registration.user.yearOfStudy}
          </div>
        )}
        {registration.user.city && registration.user.state && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {registration.user.city}, {registration.user.state}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border rounded-lg p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Solo Registration
            </h3>
            <p className="text-sm text-gray-600">
              Registered on {formatDateOnly(registration.createdAt)}
            </p>
          </div>
          <Badge
            variant={
              registration.paymentStatus === "APPROVED"
                ? "default"
                : "secondary"
            }
          >
            {registration.paymentStatus}
          </Badge>
        </div>

        <UserDetailsModal
          user={registration.user}
          userRole="solo"
          trigger={userCardContent}
        />
      </CardContent>
    </Card>
  );
}
