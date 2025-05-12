
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreHorizontal, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import EditReviewForm from "./EditReviewForm";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TestimonialProps {
  id: string;
  name: string;
  location: string;
  quote: string;
  user_email?: string | null;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, quote: string) => void;
}

const TestimonialCard = ({ id, name, location, quote, user_email, onDelete, onEdit }: TestimonialProps) => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationError, setVerificationError] = useState("");
  
  // Check if current user's email matches the testimonial email
  // We'll get the user email from localStorage for now
  const currentUserEmail = localStorage.getItem('userEmail');
  const [isOwner, setIsOwner] = useState(currentUserEmail && user_email && currentUserEmail === user_email);
  
  // Truncate the quote if it's too long
  const displayedQuote = quote.length > 120 ? `${quote.substring(0, 120)}...` : quote;
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      });
      setShowDeleteAlert(false);
    }
  };
  
  const handleEdit = (newQuote: string) => {
    if (onEdit) {
      onEdit(id, newQuote);
      setShowEditDialog(false);
      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully.",
      });
    }
  };

  const verifyOwnership = () => {
    if (verificationEmail === user_email) {
      // Store the email in localStorage for future verification
      localStorage.setItem('userEmail', verificationEmail);
      setIsOwner(true);
      setShowEmailVerification(false);
      setVerificationError("");
      toast({
        title: "Verification Successful",
        description: "You can now edit or delete your review.",
      });
    } else {
      setVerificationError("Email does not match the review's owner");
    }
  };

  return (
    <Card className="bg-white shadow-md transition-all hover:shadow-lg duration-300 hover:translate-y-[-5px]">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-amber-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.59455 16C9.59455 16.5523 9.14684 17 8.59455 17H4.59455C4.04227 17 3.59455 16.5523 3.59455 16V13C3.59455 10.7909 5.38541 9 7.59455 9H8.59455C9.14684 9 9.59455 9.44772 9.59455 10V16Z" fill="currentColor"/>
              <path d="M19.5946 16C19.5946 16.5523 19.1468 17 18.5946 17H14.5946C14.0423 17 13.5946 16.5523 13.5946 16V13C13.5946 10.7909 15.3854 9 17.5946 9H18.5946C19.1468 9 19.5946 9.44772 19.5946 10V16Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-gray-700 mb-4">{displayedQuote}</p>
          <h4 className="font-playfair font-semibold text-primary">{name}</h4>
          <p className="text-sm text-gray-500">{location}</p>
          
          {/* Options Menu */}
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Review
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setShowEmailVerification(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Verify Ownership
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Email Verification Dialog */}
          <Dialog open={showEmailVerification} onOpenChange={setShowEmailVerification}>
            <DialogContent className="sm:max-w-md">
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Verify Review Ownership</h4>
                <p className="text-sm text-gray-500">
                  Enter the email you used when creating this review to verify ownership.
                </p>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={verificationEmail}
                    onChange={(e) => setVerificationEmail(e.target.value)}
                  />
                  {verificationError && (
                    <p className="text-xs text-red-500">{verificationError}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowEmailVerification(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={verifyOwnership}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <EditReviewForm 
                id={id} 
                initialQuote={quote}
                onSubmit={handleEdit}
                onCancel={() => setShowEditDialog(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your review.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
