
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MapPin, Locate } from "lucide-react"
import React, { useState } from "react"
import { toast } from "@/hooks/use-toast"

const domesticFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(3, "Pincode is required"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10 digit Indian mobile number"),
  landmark: z.string().optional(),
});

export function DomesticDeliveryForm({ onSubmit }: { onSubmit: (values: z.infer<typeof domesticFormSchema>) => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof domesticFormSchema>>({
    resolver: zodResolver(domesticFormSchema),
    defaultValues: {
      name: "",
      streetAddress: "",
      city: "",
      state: "",
      pincode: "",
      mobileNumber: "",
      landmark: ""
    }
  });

  const handleUseLocation = async () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use Nominatim (OpenStreetMap) reverse geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data.error) {
            throw new Error("Couldn't find location details");
          }
          
          // Fill the form with location data
          form.setValue("city", data.address?.city || data.address?.town || data.address?.village || "");
          form.setValue("state", data.address?.state || "");
          form.setValue("pincode", data.address?.postcode || "");
          
          toast({
            title: "Location detected",
            description: "Your location details have been filled automatically",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get your location details. Please fill in manually.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Error",
          description: "Unable to access your location. Please check your browser permissions.",
          variant: "destructive"
        });
        setLoading(false);
      });
    } catch (error) {
      console.error("Geolocation error:", error);
      toast({
        title: "Error",
        description: "Something went wrong when trying to access your location",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="font-playfair text-xl font-bold text-primary">Domestic Delivery</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 mb-2"
          onClick={handleUseLocation}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-t-2 border-primary rounded-full animate-spin mr-2"></div>
              Detecting location...
            </>
          ) : (
            <>
              <Locate className="w-4 h-4" /> Use My Location
            </>
          )}
        </Button>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter recipient's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="Enter pincode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter 10 digit mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="landmark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landmark (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter a landmark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Save Delivery Details</Button>
      </form>
    </Form>
  )
}
