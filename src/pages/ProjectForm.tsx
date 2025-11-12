import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Upload, MapPin, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FormData {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectName: string;
  location: string;
  state: string;
  description: string;
  documents: string[];
  landArea: number;
  coordinates: { lat: number; lng: number }[];
}

const ProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    organizationName: "",
    organizationType: "",
    contactPerson: "",
    email: "",
    phone: "",
    projectName: "",
    location: "",
    state: "",
    description: "",
    documents: [],
    landArea: 0,
    coordinates: []
  });

  const navigate = useNavigate();
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { title: "Introduction", description: "Welcome to the application process" },
    { title: "Basic Information", description: "Organization and contact details" },
    { title: "Document Upload", description: "Submit required documents" },
    { title: "Land Annotation", description: "Mark your project area on the map" }
  ];

  const requiredDocuments = [
    "NGO Registration Certificate",
    "Land Ownership/Lease Documents", 
    "Environmental Impact Assessment",
    "Project Proposal Document",
    "Government Clearance Letter"
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (document: string) => {
    if (!formData.documents.includes(document)) {
      handleInputChange("documents", [...formData.documents, document]);
      toast.success(`${document} uploaded successfully!`);
    }
  };

  const handleMapClick = () => {
    // Simulate drawing a polygon on the map
    const mockCoordinates = [
      { lat: 19.0760, lng: 72.8777 },
      { lat: 19.0860, lng: 72.8877 },
      { lat: 19.0760, lng: 72.8977 },
      { lat: 19.0660, lng: 72.8777 }
    ];
    handleInputChange("coordinates", mockCoordinates);
    handleInputChange("landArea", 150); // Mock area calculation
    toast.success("Polygon drawn successfully! Area: 150 hectares");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate blockchain submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentUser = localStorage.getItem("currentUser") || "user1";
    const applicationId = Date.now().toString();
    
    // Create application for government review
    const newApplication = {
      id: applicationId,
      ngoName: formData.organizationName,
      projectName: formData.projectName,
      location: `${formData.location}, ${formData.state}`,
      area: formData.landArea,
      submittedDate: new Date().toISOString().split('T')[0],
      status: "pending",
      documents: formData.documents,
      userId: currentUser,
      ...formData
    };
    
    // Save to pending applications for government review
    const pendingApplications = JSON.parse(localStorage.getItem("pending-applications") || "[]");
    pendingApplications.push(newApplication);
    localStorage.setItem("pending-applications", JSON.stringify(pendingApplications));
    
    // Also save to NGO projects with pending status
    const savedProjects = JSON.parse(localStorage.getItem("ngo-projects") || "[]");
    const newProject = {
      id: applicationId,
      name: formData.projectName,
      status: "pending",
      location: `${formData.location}, ${formData.state}`,
      area: formData.landArea,
      submittedDate: new Date().toISOString(),
      organizationName: formData.organizationName,
      userId: currentUser
    };
    
    savedProjects.push(newProject);
    localStorage.setItem("ngo-projects", JSON.stringify(savedProjects));
    
    setIsSubmitting(false);
    toast.success("Application submitted successfully! It will be reviewed by the government.");
    navigate("/ngo-dashboard");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold mb-3">
                Welcome to Blue Carbon Registry
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for your commitment to coastal ecosystem restoration. 
                This application will help us verify your project and deploy a smart contract for monitoring.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Document Verification</div>
                <div className="text-xs text-muted-foreground">Secure blockchain storage</div>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-sm font-medium">Land Mapping</div>
                <div className="text-xs text-muted-foreground">Precise area calculation</div>
              </div>
              <div className="p-4 bg-success/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                <div className="text-sm font-medium">Smart Contract</div>
                <div className="text-xs text-muted-foreground">Automated monitoring</div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold mb-2">Organization Details</h2>
              <p className="text-muted-foreground">Tell us about your organization and project</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input 
                  id="orgName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange("organizationName", e.target.value)}
                  placeholder="Enter organization name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="orgType">Organization Type</Label>
                <Select onValueChange={(value) => handleInputChange("organizationType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="panchayat">Panchayat</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="cooperative">Cooperative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input 
                  id="contact"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="odisha">Odisha</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                placeholder="Enter your project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Project Location</Label>
              <Input 
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Konkan Coast, Village Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your blue carbon restoration project..."
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold mb-2">Document Upload</h2>
              <p className="text-muted-foreground">Upload required documents for verification</p>
            </div>

            <div className="space-y-4">
              {requiredDocuments.map((document, index) => {
                const isUploaded = formData.documents.includes(document);
                return (
                  <div 
                    key={index}
                    className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
                      ${isUploaded ? 'border-success bg-success/10' : 'border-border hover:border-primary bg-muted/30'}
                    `}
                    onClick={() => handleDocumentUpload(document)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUploaded ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : (
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{document}</div>
                          <div className="text-sm text-muted-foreground">
                            {isUploaded ? "Uploaded successfully" : "Click to upload"}
                          </div>
                        </div>
                      </div>
                      {isUploaded && (
                        <Badge variant="outline" className="bg-success/20 text-success border-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Blockchain Hash: 0x7a2b3c...
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Documents uploaded: {formData.documents.length} / {requiredDocuments.length}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold mb-2">Land Annotation</h2>
              <p className="text-muted-foreground">Mark your project area on the satellite map</p>
            </div>

            <div className="space-y-4">
              {/* Mock Map Interface */}
              <div 
                className="relative h-96 bg-muted/30 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                onClick={handleMapClick}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="text-lg font-medium">Click to Draw Project Polygon</p>
                    <p className="text-sm text-muted-foreground">
                      Click on the map to define your project boundaries
                    </p>
                  </div>
                </div>

                {formData.coordinates.length > 0 && (
                  <div className="absolute inset-0 bg-success/20 rounded-lg border-2 border-success">
                    <div className="absolute top-4 left-4 bg-background/90 p-3 rounded-lg">
                      <div className="text-sm font-medium text-success">
                        Area: {formData.landArea} hectares
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Polygon drawn successfully
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-success text-success-foreground border-success"
                      >
                        Submit to Blockchain
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {formData.coordinates.length > 0 && (
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-medium">Polygon Coordinates Captured</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.coordinates.length} coordinate points • {formData.landArea} hectares
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/ngo-dashboard")}
            className="hover:glow-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold">Project Application</h1>
            <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="text-primary font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="grid grid-cols-4 gap-4">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`text-center transition-colors ${
                      index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === totalSteps ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || formData.coordinates.length === 0}
              className="bg-gradient-forest hover:glow-accent"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting to Blockchain...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              className="bg-gradient-ocean hover:glow-primary"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;