"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/Auth";
import debounce from "lodash.debounce";
import {
  Loader2,
  Users,
  Calendar,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  UserCheck,
  Info,
} from "lucide-react";

interface TeamInvitation {
  id: string;
  email: string;
  name: string;
  status: string;
  team: {
    id: string;
    name: string;
    competition: {
      id: string;
      title: string;
      description: string;
      type: "SOLO" | "TEAM";
      registrationFee: number;
      registrationDeadline: string;
    };
    leader: {
      id: string;
      name: string;
      email: string;
    };
    members: Array<{
      id: string;
      name: string;
      email: string;
      status: string;
    }>;
  };
}

interface UserInfo {
  phone: string;
  gender: string;
  collegeName: string;
  yearOfStudy: string;
  state: string;
  city: string;
  collegeIdPic: File | null;
  govtIdPic: File | null;
}

type FormStep = "auth" | "details" | "review" | "success";

export default function TeamJoinPage() {
  const params = useParams() as { teamId: string; email: string };
  const router = useRouter();
  const { user, logout } = useAuth();
  const { teamId, email } = params;

  // Decode email if it's URL encoded
  const decodedEmail = decodeURIComponent(email);

  // Authentication handlers
  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await logout();
      // After logout, redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.href);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      window.location.href = `${apiUrl}/auth/google?returnUrl=${returnUrl}`;
    } catch (error) {
      console.error("Logout failed:", error);
      setAuthLoading(false);
      // If logout fails, still redirect to login
      const returnUrl = encodeURIComponent(window.location.href);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      window.location.href = `${apiUrl}/auth/google?returnUrl=${returnUrl}`;
    }
  };

  const handleLogin = () => {
    setAuthLoading(true);
    // Redirect to backend Google auth with return URL to come back to this page
    const returnUrl = encodeURIComponent(window.location.href);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    window.location.href = `${apiUrl}/auth/google?returnUrl=${returnUrl}`;
  };

  // State
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>("auth");
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];
  // Form state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    phone: "",
    gender: "",
    collegeName: "",
    yearOfStudy: "",
    state: "",
    city: "",
    collegeIdPic: null,
    govtIdPic: null,
  });
  const [collegeIdPreview, setCollegeIdPreview] = useState<string | null>(null);
  const [govtIdPreview, setGovtIdPreview] = useState<string | null>(null);

  // Fetch invitation details
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/registeration/invitation/${teamId}/${encodeURIComponent(
            decodedEmail
          )}`
        );

        setInvitation(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Failed to fetch invitation details"
        );
        console.error("Error fetching invitation:", err);
      } finally {
        setLoading(false);
      }
    };

    if (teamId && decodedEmail) {
      fetchInvitation();
    }
  }, [teamId, decodedEmail]);

  // Check authentication and move to appropriate step
  useEffect(() => {
    if (invitation && user) {
      // FIRST CHECK: Verify user email matches invitation email
      if (user.email?.toLowerCase() !== decodedEmail.toLowerCase()) {
        setError(
          `This invitation is for ${decodedEmail}, but you're signed in as ${user.email}. Please sign in with the correct account.`
        );
        setCurrentStep("auth");
        return;
      }

      // Check if user already has required info
      const hasRequiredInfo =
        user.phone && user.collegeName && user.yearOfStudy;
      setCurrentStep(hasRequiredInfo ? "review" : "details");

      if (hasRequiredInfo) {
        // Pre-fill form with existing data
        setUserInfo((prev) => ({
          ...prev,
          phone: user.phone || "",
          gender: user.gender || "",
          collegeName: user.collegeName || "",
          yearOfStudy: user.yearOfStudy || "",
          state: user.state || "",
          city: user.city || "",
        }));
      }
    } else if (invitation && !user) {
      setCurrentStep("auth");
    }
  }, [invitation, user, decodedEmail]);

  // File handling
  const handleFileUpload = (
    file: File | null,
    type: "collegeId" | "govtId"
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === "collegeId") {
        setCollegeIdPreview(result);
        setUserInfo((prev) => ({ ...prev, collegeIdPic: file }));
      } else {
        setGovtIdPreview(result);
        setUserInfo((prev) => ({ ...prev, govtIdPic: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Validation
  const validateDetails = (): string | null => {
    if (!userInfo.phone.trim()) return "Phone number is required";
    if (!userInfo.gender.trim()) return "Gender is required";
    if (!userInfo.collegeName.trim()) return "College name is required";
    if (!userInfo.yearOfStudy.trim()) return "Year of study is required";
    if (!userInfo.state.trim()) return "State is required";
    if (!userInfo.city.trim()) return "City is required";
    if (!userInfo.collegeIdPic) return "College ID photo is required";
    if (!userInfo.govtIdPic) return "Government ID photo is required";

    return null;
  };

  // Submit handler
  const handleJoinTeam = async () => {
    const validationError = validateDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("teamId", teamId);
      formData.append("email", decodedEmail);
      formData.append("phone", userInfo.phone);
      formData.append("gender", userInfo.gender);
      formData.append("collegeName", userInfo.collegeName);
      formData.append("yearOfStudy", userInfo.yearOfStudy);
      formData.append("state", userInfo.state);
      formData.append("city", userInfo.city);

      if (userInfo.collegeIdPic) {
        formData.append("collegeIdPic", userInfo.collegeIdPic);
      }
      if (userInfo.govtIdPic) {
        formData.append("govtIdPic", userInfo.govtIdPic);
      }

      const response = await axiosInstance.post(
        "/registeration/invite/accept",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCurrentStep("success");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to join team";
      const errorCode = err.response?.data?.code;

      // Handle email mismatch error specifically
      if (errorCode === "EMAIL_MISMATCH") {
        setError(
          `This invitation is not for your email address. Please sign in with the correct account (${decodedEmail}).`
        );
        setCurrentStep("auth");
      } else {
        setError(errorMessage);
      }
      console.error("Join team error:", err);
    } finally {
      setSubmitting(false);
    }
  };
  const fetchCitySuggestions = async (query: string) => {
    if (query.length < 2 || query.length > 45) {
      setCitySuggestions([]);
      return;
    }

    setCityLoading(true);
    try {
      const response = await fetch(
        `/api/autocomplete?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (response.ok && data.suggestions) {
        // Map Google Places API (New) response format
        const mappedSuggestions = data.suggestions.map((item: any) => ({
          placeName: item.placePrediction?.text?.text || "",
          placeAddress:
            item.placePrediction?.structuredFormat?.secondaryText?.text || "",
          placeId: item.placePrediction?.placeId || "",
          eLoc: item.placePrediction?.placeId || "",
        }));
        setCitySuggestions(mappedSuggestions);
      } else {
        setCitySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching city autocomplete data:", error);
      setCitySuggestions([]);
    } finally {
      setCityLoading(false);
    }
  };

  // Memoize and debounce the fetch function
  const debouncedFetchCitySuggestions = useMemo(
    () => debounce(fetchCitySuggestions, 300),
    [] // Only create once
  );

  // Cleanup the debounce function on unmount (important!)
  useEffect(() => {
    return () => {
      debouncedFetchCitySuggestions.cancel();
    };
  }, [debouncedFetchCitySuggestions]);

  // Handle city input change
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 1. Update the form state immediately
    setUserInfo((prev) => ({ ...prev, city: value }));

    // 2. Fetch suggestions with the debounced function
    debouncedFetchCitySuggestions(value);

    // 3. Show the suggestions list
    setShowCitySuggestions(true);
  };

  // Handle clicking a suggestion
  const handleCitySuggestionClick = (suggestion: any) => {
    // Use 'placeName' from the Mappls response
    const selectedCity = suggestion.placeName;

    setUserInfo((prev) => ({ ...prev, city: selectedCity }));
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading invitation details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="font-semibold text-red-600 mb-2">
                Invitation Not Found
              </p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button
                onClick={() => router.push("/Competitions")}
                variant="outline"
              >
                Browse Competitions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) return null;

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case "auth":
        return renderAuthStep();
      case "details":
        return renderDetailsStep();
      case "review":
        return renderReviewStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderAuthStep();
    }
  };

  const renderAuthStep = () => (
    <div className="text-center py-12">
      <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold mb-2">Join Team Invitation</h3>
      <p className="text-gray-600 mb-6">
        You've been invited to join <strong>{invitation.team.name}</strong> for{" "}
        <strong>{invitation.team.competition.title}</strong>
      </p>

      {user && user.email?.toLowerCase() !== decodedEmail.toLowerCase() ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            <strong>Wrong Account!</strong> This invitation is for{" "}
            <strong>{decodedEmail}</strong>, but you're signed in as{" "}
            <strong>{user.email}</strong>.
          </p>
          <p className="text-sm text-red-700 mt-2">
            Please sign out of your current account and sign in with the correct
            email address to continue.
          </p>
        </div>
      ) : user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Perfect!</strong> You're signed in as{" "}
            <strong>{user.email}</strong>, which matches this invitation. Click
            continue to proceed with joining the team.
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Please sign in with Google to continue with the invitation process.
            Make sure to use the email address: <strong>{decodedEmail}</strong>
          </p>
        </div>
      )}

      <div className="space-y-3">
        {user && user.email?.toLowerCase() !== decodedEmail.toLowerCase() ? (
          <>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                "Sign Out Current Account"
              )}
            </Button>
            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                `Sign In with ${decodedEmail}`
              )}
            </Button>
          </>
        ) : user ? (
          <Button
            onClick={() => {
              // Check if user already has required info and proceed accordingly
              const hasRequiredInfo =
                user.phone && user.collegeName && user.yearOfStudy;
              setCurrentStep(hasRequiredInfo ? "review" : "details");
            }}
            className="w-full"
          >
            Continue with Team Registration
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={authLoading}
          >
            {authLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Sign in with Google"
            )}
          </Button>
        )}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Complete Your Profile</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please provide the following information to complete your team
          registration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <select
              id="gender"
              value={userInfo.gender}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <Label htmlFor="collegeName">College Name *</Label>
            <Input
              id="collegeName"
              type="text"
              value={userInfo.collegeName}
              onChange={(e) =>
                setUserInfo((prev) => ({
                  ...prev,
                  collegeName: e.target.value,
                }))
              }
              placeholder="Enter your college name"
            />
          </div>

          <div>
            <Label htmlFor="yearOfStudy">Year of Study *</Label>
            <select
              id="yearOfStudy"
              value={userInfo.yearOfStudy}
              onChange={(e) =>
                setUserInfo((prev) => ({
                  ...prev,
                  yearOfStudy: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="5th">5th Year</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <select
              id="state"
              value={userInfo.state}
              onChange={(e) =>
                setUserInfo((prev) => ({
                  ...prev,
                  state: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Your State</option>
              {states.map((state) => {
                return (
                  <option key={state} value={state}>
                    {state}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <div className="relative">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={userInfo.city}
                onChange={handleCityChange} // Uses the debounced Mappls search handler
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() =>
                  // Delay hiding the suggestions to allow time for the user to click a suggestion
                  setTimeout(() => setShowCitySuggestions(false), 200)
                }
                placeholder="Start typing your city..."
              />

              {/* Suggestions Dropdown */}
              {showCitySuggestions && userInfo.city.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {cityLoading ? (
                    <li className="p-2 text-gray-500 flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </li>
                  ) : citySuggestions.length > 0 ? (
                    citySuggestions.map((suggestion) => (
                      <li
                        key={suggestion.eLoc}
                        className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                        // onMouseDown is used to fire before the onBlur event of the input
                        onMouseDown={() =>
                          handleCitySuggestionClick(suggestion)
                        }
                      >
                        <strong>{suggestion.placeName}</strong> (
                        {suggestion.placeAddress})
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500 text-sm">
                      No city results found
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Document Upload</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* College ID Upload */}
          <div>
            <Label htmlFor="collegeId">College ID Photo *</Label>
            <div className="mt-2">
              <Input
                id="collegeId"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload(file, "collegeId");
                }}
                className="mb-2"
              />
              {collegeIdPreview && (
                <div className="mt-2">
                  <img
                    src={collegeIdPreview}
                    alt="College ID Preview"
                    className="w-full max-w-48 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Government ID Upload */}
          <div>
            <Label htmlFor="govtId">Government ID Photo *</Label>
            <div className="mt-2">
              <Input
                id="govtId"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload(file, "govtId");
                }}
                className="mb-2"
              />
              {govtIdPreview && (
                <div className="mt-2">
                  <img
                    src={govtIdPreview}
                    alt="Government ID Preview"
                    className="w-full max-w-48 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Please ensure that the uploaded documents are
            clear and readable. Accepted formats: JPG, PNG, GIF. Maximum file
            size: 5MB.
          </p>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review and Join Team</h3>

      {/* Team Information */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Team Details</h4>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Competition:</strong> {invitation.team.competition.title}
          </div>
          <div>
            <strong>Team Name:</strong> {invitation.team.name}
          </div>
          <div>
            <strong>Team Leader:</strong> {invitation.team.leader.name} (
            {invitation.team.leader.email})
          </div>
          <div>
            <strong>Current Members:</strong>{" "}
            {invitation.team.members.length + 1}
          </div>
          <div>
            <strong>Registration Fee:</strong> ₹
            {invitation.team.competition.registrationFee || 0}
          </div>
        </div>
      </div>

      {/* Your Information */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Your Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Phone:</strong> {userInfo.phone}
          </div>
          <div>
            <strong>Gender:</strong> {userInfo.gender}
          </div>
          <div>
            <strong>College:</strong> {userInfo.collegeName}
          </div>
          <div>
            <strong>Year of Study:</strong> {userInfo.yearOfStudy}
          </div>
          <div>
            <strong>State:</strong> {userInfo.state}
          </div>
          <div>
            <strong>City:</strong> {userInfo.city}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Uploaded Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">College ID:</p>
            {collegeIdPreview && (
              <img
                src={collegeIdPreview}
                alt="College ID"
                className="w-32 h-20 object-cover rounded border"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Government ID:</p>
            {govtIdPreview && (
              <img
                src={govtIdPreview}
                alt="Government ID"
                className="w-32 h-20 object-cover rounded border"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-green-600 mb-2">
        Successfully Joined Team!
      </h3>
      <p className="text-gray-600 mb-6">
        You are now a member of <strong>{invitation.team.name}</strong> for{" "}
        <strong>{invitation.team.competition.title}</strong>
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-800">
          <strong>What's next:</strong> Your team leader will handle the payment
          process. You'll be notified about further updates via email.
        </p>
      </div>

      <div className="space-y-3">
        <Button onClick={() => router.push("/Competitions")} className="w-full">
          Browse Other Competitions
        </Button>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="w-full"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Team Invitation</CardTitle>
                <p className="text-gray-600 mb-4">
                  Join {invitation.team.name} for{" "}
                  {invitation.team.competition.title}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    Team Competition
                  </Badge>
                  <Badge variant="outline">
                    <DollarSign className="h-3 w-3 mr-1" />₹
                    {invitation.team.competition.registrationFee || 0}
                  </Badge>
                  <Badge variant="default">
                    <Calendar className="h-3 w-3 mr-1" />
                    Invitation Pending
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === "auth" && "Authentication Required"}
              {currentStep === "details" && "Complete Profile"}
              {currentStep === "review" && "Review & Join"}
              {currentStep === "success" && "Welcome to the Team!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Error Messages */}
            {error && (
              <Alert className="mt-4">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            {(currentStep === "details" || currentStep === "review") && (
              <div className="flex gap-4 pt-6">
                {currentStep === "review" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("details")}
                    className="flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                )}

                <div className="flex-1" />

                {currentStep === "details" ? (
                  <Button
                    onClick={() => {
                      const validationError = validateDetails();
                      if (validationError) {
                        setError(validationError);
                        return;
                      }
                      setError(null);
                      setCurrentStep("review");
                    }}
                    className="flex items-center"
                  >
                    Review
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoinTeam}
                    disabled={submitting}
                    className="flex items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Joining Team...
                      </>
                    ) : (
                      <>
                        Join Team
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
