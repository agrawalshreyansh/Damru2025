"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  School,
  MapPin,
  Calendar,
  User,
  FileImage,
  Eye,
  Download,
} from "lucide-react";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  collegeName?: string;
  yearOfStudy?: string;
  state?: string;
  city?: string;
  collegeIdPic?: string;
  govtIdPic?: string;
  createdAt?: string;
}

interface UserDetailsModalProps {
  user: UserDetails;
  trigger: React.ReactNode;
  userRole?: string; // "leader" | "member" | "solo"
  memberStatus?: string; // for team members
}

export default function UserDetailsModal({
  user,
  trigger,
  userRole = "solo",
  memberStatus,
}: UserDetailsModalProps) {
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (imageType: string) => {
    setImageError((prev) => ({ ...prev, [imageType]: true }));
  };

  const handleImageDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    // If the path starts with 'uploads/', we need to convert it to the correct URL
    if (imagePath.startsWith("uploads/images/")) {
      const filename = imagePath.replace("uploads/images/", "");
      return `${baseUrl}/images/${filename}`;
    }

    // If it's already a full URL, use it as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Otherwise, assume it's just a filename in the images directory

    return `${baseUrl}/uploads/images/${imagePath}`;
  };

  const ImageViewer = ({
    imageUrl,
    alt,
    type,
  }: {
    imageUrl: string;
    alt: string;
    type: string;
  }) => {
    const hasError = imageError[type];
    const processedImageUrl = getImageUrl(imageUrl);
    if (!processedImageUrl || hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
          <FileImage className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {hasError ? "Failed to load image" : "No image uploaded"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <img
          src={processedImageUrl}
          alt={alt}
          className="w-full h-48 object-cover rounded-lg border shadow-sm"
          onError={() => handleImageError(type)}
        />
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(processedImageUrl, "_blank")}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleImageDownload(processedImageUrl, `${user.name}_${type}.jpg`)
            }
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {user.name}'s Details
            {userRole && (
              <Badge variant="outline" className="ml-2">
                {userRole === "leader"
                  ? "Team Leader"
                  : userRole === "member"
                  ? "Team Member"
                  : "Solo Participant"}
              </Badge>
            )}
            {memberStatus && (
              <Badge
                variant={
                  memberStatus === "ACCEPTED"
                    ? "default"
                    : memberStatus === "PENDING"
                    ? "secondary"
                    : "outline"
                }
              >
                {memberStatus}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="font-medium">{user.phone}</span>
                    </div>
                  )}

                  {user.gender && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">
                        {user.gender}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {user.collegeName && (
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">College:</span>
                      <span className="font-medium">{user.collegeName}</span>
                    </div>
                  )}

                  {user.yearOfStudy && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Year of Study:
                      </span>
                      <span className="font-medium">{user.yearOfStudy}</span>
                    </div>
                  )}

                  {user.city && user.state && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="font-medium">
                        {user.city}, {user.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* College ID */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">College ID</h4>
                  <ImageViewer
                    imageUrl={user.collegeIdPic || ""}
                    alt={`${user.name}'s College ID`}
                    type="college"
                  />
                </div>

                {/* Government ID */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Government ID
                  </h4>
                  <ImageViewer
                    imageUrl={user.govtIdPic || ""}
                    alt={`${user.name}'s Government ID`}
                    type="government"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Click on the images to view in full
                  size or download them. These documents were uploaded during
                  registration for verification purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {user.createdAt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Registration Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Registered on:</span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
