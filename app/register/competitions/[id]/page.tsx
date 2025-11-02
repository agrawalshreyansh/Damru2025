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
import { Textarea } from "@/components/ui/textarea";
import debounce from "lodash.debounce";
import {
  Loader2,
  Users,
  Calendar,
  DollarSign,
  Plus,
  X,
  Info,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  UserCheck,
} from "lucide-react";

interface Competition {
  id: string;
  title: string;
  description: string;
  registrationFee: number;
  registrationDeadline: string;
  type: "SOLO" | "TEAM";
  maxTeamSize?: number;
  minTeamSize?: number;
  otherRewards?: string;
  detailsMdPath?: string;
  imagePath?: string;
}

interface Teammate {
  name: string;
  email: string;
}

interface LeaderInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
  collegeName: string;
  yearOfStudy: string;
  state: string;
  city: string;
  collegeIdPic: File | null;
  govtIdPic: File | null;
}

type FormStep = "basic" | "details" | "team" | "review" | "success";

export default function CompetitionRegistrationPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const competitionId = params.id;

  // State
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
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
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    collegeName: "",
    yearOfStudy: "",
    state: "",
    city: "",
    collegeIdPic: null,
    govtIdPic: null,
  });
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [collegeIdPreview, setCollegeIdPreview] = useState<string | null>(null);
  const [govtIdPreview, setGovtIdPreview] = useState<string | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Fetch competition details and check registration status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch competition details
        const competitionResponse = await axiosInstance.get(
          `/competitions/${competitionId}`
        );
        const competitionData =
          competitionResponse.data.competition || competitionResponse.data;
        setCompetition(competitionData);

        // Check if user is already registered
        try {
          const registrationResponse = await axiosInstance.get(
            `/registeration/status/${competitionId}`
          );
          if (registrationResponse.data.isRegistered) {
            setIsAlreadyRegistered(true);
            return;
          }
        } catch (regError: any) {
          // If 401, user is not authenticated, continue with registration
          if (regError.response?.status !== 401) {
            console.error("Error checking registration status:", regError);
          }
        }

        // Initialize teammates array based on competition requirements
        if (competitionData.type === "TEAM" && competitionData.minTeamSize) {
          const minTeammates = Math.max(
            (competitionData.minTeamSize || 2) - 1,
            0
          );
          setTeammates(
            Array(minTeammates)
              .fill(null)
              .map(() => ({ name: "", email: "" }))
          );
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch competition details"
        );
        console.error("Error fetching competition:", err);
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      fetchData();
    }
  }, [competitionId]);

  // Helper functions
  const isRegistrationOpen = (deadline: string): boolean => {
    return new Date() < new Date(deadline);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        setLeaderInfo((prev) => ({ ...prev, collegeIdPic: file }));
      } else {
        setGovtIdPreview(result);
        setLeaderInfo((prev) => ({ ...prev, govtIdPic: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Form navigation
  const nextStep = () => {
    if (currentStep === "basic") setCurrentStep("details");
    else if (currentStep === "details") {
      setCurrentStep(competition?.type === "TEAM" ? "team" : "review");
    } else if (currentStep === "team") setCurrentStep("review");
  };

  const prevStep = () => {
    if (currentStep === "details") setCurrentStep("basic");
    else if (currentStep === "team") setCurrentStep("details");
    else if (currentStep === "review") {
      setCurrentStep(competition?.type === "TEAM" ? "team" : "details");
    }
  };

  const addTeammate = () => {
    if (competition && teammates.length < (competition.maxTeamSize || 10) - 1) {
      setTeammates([...teammates, { name: "", email: "" }]);
    }
  };

  const removeTeammate = (index: number) => {
    const minRequired = (competition?.minTeamSize || 2) - 1;
    if (teammates.length > minRequired) {
      setTeammates(teammates.filter((_, i) => i !== index));
    }
  };

  const updateTeammate = (
    index: number,
    field: keyof Teammate,
    value: string
  ) => {
    const updated = [...teammates];
    updated[index][field] = value;
    setTeammates(updated);
  };

  // Validation
  const validateBasicInfo = (): string | null => {
    if (!leaderInfo.name.trim()) return "Name is required";
    if (!leaderInfo.email.trim()) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderInfo.email)) return "Invalid email format";

    return null;
  };

  const validateDetails = (): string | null => {
    if (!leaderInfo.phone.trim()) return "Phone number is required";
    if (!leaderInfo.gender.trim()) return "Gender is required";
    if (!leaderInfo.collegeName.trim()) return "College name is required";
    if (!leaderInfo.yearOfStudy.trim()) return "Year of study is required";
    if (!leaderInfo.state.trim()) return "State is required";
    if (!leaderInfo.city.trim()) return "City is required";
    if (!leaderInfo.collegeIdPic) return "College ID photo is required";
    if (!leaderInfo.govtIdPic) return "Government ID photo is required";

    return null;
  };

  const validateTeam = (): string | null => {
    if (competition?.type !== "TEAM") return null;

    const validTeammates = teammates.filter(
      (t) => t.email.trim() && t.name.trim()
    );
    const totalMembers = validTeammates.length + 1; // +1 for leader

    if (competition.minTeamSize && totalMembers < competition.minTeamSize) {
      return `Team must have at least ${competition.minTeamSize} members (including leader)`;
    }

    if (competition.maxTeamSize && totalMembers > competition.maxTeamSize) {
      return `Team cannot exceed ${competition.maxTeamSize} members (including leader)`;
    }

    // Validate teammate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const teammate of validTeammates) {
      if (!emailRegex.test(teammate.email)) {
        return `Invalid email for teammate: ${teammate.name || teammate.email}`;
      }
    }

    // Check for duplicate emails
    const allEmails = [leaderInfo.email, ...validTeammates.map((t) => t.email)];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      return "Duplicate emails are not allowed";
    }

    return null;
  };

  // Submit handler
  const handleSubmit = async () => {
    // Final validation
    const basicError = validateBasicInfo();
    const detailsError = validateDetails();
    const teamError = validateTeam();

    if (basicError || detailsError || teamError) {
      setError(basicError || detailsError || teamError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("competitionId", competitionId);
      formData.append("phone", leaderInfo.phone);
      formData.append("gender", leaderInfo.gender);
      formData.append("collegeName", leaderInfo.collegeName);
      formData.append("yearOfStudy", leaderInfo.yearOfStudy);
      formData.append("state", leaderInfo.state);
      formData.append("city", leaderInfo.city);

      if (leaderInfo.collegeIdPic) {
        formData.append("collegeIdPic", leaderInfo.collegeIdPic);
      }
      if (leaderInfo.govtIdPic) {
        formData.append("govtIdPic", leaderInfo.govtIdPic);
      }

      // Add teammates if it's a team competition
      if (competition?.type === "TEAM") {
        const validTeammates = teammates.filter(
          (t) => t.email.trim() && t.name.trim()
        );
        if (validTeammates.length > 0) {
          formData.append("teammates", JSON.stringify(validTeammates));
        }
      }

      const response = await axiosInstance.post(
        "/registeration/competition",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(response.data.message || "Registration successful!");
      setCurrentStep("success");
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Registration failed"
      );
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Step navigation with validation
  const handleNext = () => {
    let validationError = null;

    if (currentStep === "basic") {
      validationError = validateBasicInfo();
    } else if (currentStep === "details") {
      validationError = validateDetails();
    } else if (currentStep === "team") {
      validationError = validateTeam();
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    nextStep();
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
    setLeaderInfo((prev) => ({ ...prev, city: value }));

    // 2. Fetch suggestions with the debounced function
    debouncedFetchCitySuggestions(value);

    // 3. Show the suggestions list
    setShowCitySuggestions(true);
  };

  // Handle clicking a suggestion
  const handleCitySuggestionClick = (suggestion: any) => {
    // Use 'placeName' from the Mappls response
    const selectedCity = suggestion.placeName;

    setLeaderInfo((prev) => ({ ...prev, city: selectedCity }));
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading competition details...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="font-semibold text-red-600">
                Competition Not Found
              </p>
              <p className="text-sm text-gray-600 mt-2">
                The competition you're looking for doesn't exist or has been
                removed.
              </p>
              <Button
                onClick={() => router.back()}
                className="mt-4"
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already registered view
  if (isAlreadyRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <UserCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="font-semibold text-green-600 text-lg mb-2">
                Already Registered!
              </p>
              <p className="text-sm text-gray-600 mb-4">
                You are already registered for this competition.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/Competitions")}
                  className="w-full"
                >
                  Browse Other Competitions
                </Button>
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const registrationOpen = isRegistrationOpen(competition.registrationDeadline);

  // Render different form steps
  const renderFormStep = () => {
    switch (currentStep) {
      case "basic":
        return renderBasicInfoStep();
      case "details":
        return renderDetailsStep();
      case "team":
        return renderTeamStep();
      case "review":
        return renderReviewStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderBasicInfoStep();
    }
  };

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {competition.type === "TEAM"
            ? "Team Leader Information"
            : "Your Information"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={leaderInfo.name}
              onChange={(e) =>
                setLeaderInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={leaderInfo.email}
              onChange={(e) =>
                setLeaderInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email address"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Personal & Academic Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={leaderInfo.phone}
              onChange={(e) =>
                setLeaderInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <select
              id="gender"
              value={leaderInfo.gender}
              onChange={(e) =>
                setLeaderInfo((prev) => ({ ...prev, gender: e.target.value }))
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
              value={leaderInfo.collegeName}
              onChange={(e) =>
                setLeaderInfo((prev) => ({
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
              value={leaderInfo.yearOfStudy}
              onChange={(e) =>
                setLeaderInfo((prev) => ({
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
              value={leaderInfo.state}
              onChange={(e) =>
                setLeaderInfo((prev) => ({
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
            <div className="relative">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={leaderInfo.city}
                onChange={handleCityChange} // Uses the debounced Mappls search handler
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() =>
                  // Delay hiding the suggestions to allow time for the user to click a suggestion
                  setTimeout(() => setShowCitySuggestions(false), 200)
                }
                placeholder="Start typing your city..."
              />

              {/* Suggestions Dropdown */}
              {showCitySuggestions && leaderInfo.city.length > 0 && (
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

  const renderTeamStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTeammate}
          disabled={teammates.length >= (competition.maxTeamSize || 10) - 1}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </div>

      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Team Requirements:</strong>
        </p>
        <ul className="text-sm text-yellow-800 mt-1 space-y-1">
          <li>
            • Minimum team size: {competition.minTeamSize} members (including
            leader)
          </li>
          <li>
            • Maximum team size: {competition.maxTeamSize} members (including
            leader)
          </li>
          <li>
            • Currently filled:{" "}
            {teammates.filter((t) => t.name.trim() && t.email.trim()).length +
              1}{" "}
            members
          </li>
          <li>
            • Team members will receive email invitations to join your team
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        {teammates.map((teammate, index) => (
          <div
            key={index}
            className="flex gap-3 items-end p-4 border rounded-lg"
          >
            <div className="flex-1">
              <Label htmlFor={`teammate-name-${index}`}>
                Name{" "}
                {index < Math.max((competition.minTeamSize || 2) - 1, 0)
                  ? "*"
                  : ""}
              </Label>
              <Input
                id={`teammate-name-${index}`}
                type="text"
                value={teammate.name}
                onChange={(e) => updateTeammate(index, "name", e.target.value)}
                placeholder={`Teammate ${index + 1} name`}
              />
            </div>

            <div className="flex-1">
              <Label htmlFor={`teammate-email-${index}`}>
                Email{" "}
                {index < Math.max((competition.minTeamSize || 2) - 1, 0)
                  ? "*"
                  : ""}
              </Label>
              <Input
                id={`teammate-email-${index}`}
                type="email"
                value={teammate.email}
                onChange={(e) => updateTeammate(index, "email", e.target.value)}
                placeholder={`Teammate ${index + 1} email`}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTeammate(index)}
              disabled={
                teammates.length <=
                Math.max((competition.minTeamSize || 2) - 1, 0)
              }
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {teammates.length === 0 &&
          competition.minTeamSize &&
          competition.minTeamSize > 1 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-2">No team members added yet</p>
              <p className="text-sm text-gray-400">
                Add at least {Math.max((competition.minTeamSize || 2) - 1, 0)}{" "}
                team members to continue
              </p>
            </div>
          )}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Registration</h3>

      {/* Personal Information */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Name:</strong> {leaderInfo.name}
          </div>
          <div>
            <strong>Email:</strong> {leaderInfo.email}
          </div>
          <div>
            <strong>Phone:</strong> {leaderInfo.phone}
          </div>
          <div>
            <strong>Gender:</strong> {leaderInfo.gender}
          </div>
          <div>
            <strong>College:</strong> {leaderInfo.collegeName}
          </div>
          <div>
            <strong>Year of Study:</strong> {leaderInfo.yearOfStudy}
          </div>
          <div>
            <strong>State:</strong> {leaderInfo.state}
          </div>
          <div>
            <strong>City:</strong> {leaderInfo.city}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Documents</h4>
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

      {/* Team Information */}
      {competition.type === "TEAM" && (
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Team Information</h4>
          <p className="text-sm text-gray-600 mb-2">
            Team Leader: {leaderInfo.name} ({leaderInfo.email})
          </p>
          {teammates.filter((t) => t.name.trim() && t.email.trim()).length >
          0 ? (
            <div>
              <p className="text-sm font-medium mb-2">Team Members:</p>
              <ul className="space-y-1">
                {teammates
                  .filter((t) => t.name.trim() && t.email.trim())
                  .map((teammate, index) => (
                    <li key={index} className="text-sm">
                      {teammate.name} ({teammate.email})
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No team members added</p>
          )}
        </div>
      )}

      {/* Competition Details */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Competition Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Competition:</strong> {competition.title}
          </div>
          <div>
            <strong>Type:</strong> {competition.type}
          </div>
          <div>
            <strong>Registration Fee:</strong> ₹
            {competition.registrationFee || 0}
          </div>
          <div>
            <strong>Deadline:</strong>{" "}
            {formatDate(competition.registrationDeadline)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-green-600 mb-2">
        Registration Successful!
      </h3>
      <p className="text-gray-600 mb-6">
        {success ||
          `You have successfully registered for ${competition.title}.`}
      </p>

      {competition.type === "TEAM" &&
        teammates.filter((t) => t.name.trim() && t.email.trim()).length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> Your team members will receive email
              invitations. They need to accept the invitations to complete the
              team formation.
            </p>
          </div>
        )}

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
        {/* Competition Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {competition.title}
                </CardTitle>
                <p className="text-gray-600 mb-4">{competition.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant={
                      competition.type === "SOLO" ? "default" : "secondary"
                    }
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {competition.type} Competition
                  </Badge>
                  {competition.registrationFee && (
                    <Badge variant="outline">
                      <DollarSign className="h-3 w-3 mr-1" />₹
                      {competition.registrationFee}
                    </Badge>
                  )}
                  <Badge variant={registrationOpen ? "default" : "destructive"}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {registrationOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
              {competition.imagePath && (
                <img
                  src={competition.imagePath}
                  alt={competition.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Registration Deadline:</strong>{" "}
                {formatDate(competition.registrationDeadline)}
              </p>
              {competition.type === "TEAM" && (
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Team Size:</strong> {competition.minTeamSize}-
                  {competition.maxTeamSize} members
                </p>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Multi-Step Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Registration Form
              <Badge variant="outline">
                Step{" "}
                {currentStep === "basic"
                  ? 1
                  : currentStep === "details"
                  ? 2
                  : currentStep === "team"
                  ? 3
                  : currentStep === "review"
                  ? 4
                  : 5}{" "}
                of {competition.type === "TEAM" ? 5 : 4}
              </Badge>
            </CardTitle>
            {!registrationOpen && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Registration for this competition has closed.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent>
            {registrationOpen ? (
              <div className="space-y-6">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center ${
                        currentStep === "basic"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          currentStep === "basic"
                            ? "border-blue-600 bg-blue-50"
                            : "border-green-600 bg-green-50"
                        }`}
                      >
                        {currentStep === "basic" ? (
                          "1"
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        Basic Info
                      </span>
                    </div>

                    <div className="w-8 h-px bg-gray-300" />

                    <div
                      className={`flex items-center ${
                        currentStep === "basic"
                          ? "text-gray-400"
                          : currentStep === "details"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          currentStep === "basic"
                            ? "border-gray-300 bg-gray-50"
                            : currentStep === "details"
                            ? "border-blue-600 bg-blue-50"
                            : "border-green-600 bg-green-50"
                        }`}
                      >
                        {currentStep === "basic" ? (
                          "2"
                        ) : currentStep === "details" ? (
                          "2"
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        Details & Documents
                      </span>
                    </div>

                    {competition.type === "TEAM" && (
                      <>
                        <div className="w-8 h-px bg-gray-300" />
                        <div
                          className={`flex items-center ${
                            ["basic", "details"].includes(currentStep)
                              ? "text-gray-400"
                              : currentStep === "team"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              ["basic", "details"].includes(currentStep)
                                ? "border-gray-300 bg-gray-50"
                                : currentStep === "team"
                                ? "border-blue-600 bg-blue-50"
                                : "border-green-600 bg-green-50"
                            }`}
                          >
                            {["basic", "details"].includes(currentStep) ? (
                              "3"
                            ) : currentStep === "team" ? (
                              "3"
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </div>
                          <span className="ml-2 text-sm font-medium">
                            Team Members
                          </span>
                        </div>
                      </>
                    )}

                    <div className="w-8 h-px bg-gray-300" />

                    <div
                      className={`flex items-center ${
                        currentStep === "review"
                          ? "text-blue-600"
                          : currentStep === "success"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          currentStep === "review"
                            ? "border-blue-600 bg-blue-50"
                            : currentStep === "success"
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        {currentStep === "success" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : competition.type === "TEAM" ? (
                          "4"
                        ) : (
                          "3"
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        Review & Submit
                      </span>
                    </div>
                  </div>
                </div>

                {renderFormStep()}

                {/* Error Messages */}
                {error && (
                  <Alert>
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Navigation Buttons */}
                {currentStep !== "success" && (
                  <div className="flex gap-4 pt-6">
                    {currentStep !== "basic" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}

                    <div className="flex-1" />

                    {currentStep === "review" ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Register Now
                            <CheckCircle className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="flex items-center"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
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
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Registration for this competition has ended.
                </p>
                <Button onClick={() => router.back()} variant="outline">
                  Browse Other Competitions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
