import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Locate } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useState } from "react"
import SelectLocationMap from "./SelectLocationMap"

const formSchema = z.object({
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State/Province must be at least 2 characters"),
  country: z.string().min(2, "Please select a country"),
  manualCountry: z.string().optional(), // used if country is "other"
  postalCode: z.string().min(3, "Postal/ZIP code is required"),
  landmark: z.string().optional(),
  mobileNumber: z.string()
    .regex(/^\+?[1-9]\d{6,14}$/, "Please enter a valid international phone number with country code")
}).refine(
  (data) => {
    if (data.country === "other") return data.manualCountry && data.manualCountry.length > 1
    return true
  },
  {
    message: "Please enter country name",
    path: ["manualCountry"]
  }
);

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "other", label: "Other" },
];

export function DeliveryDetailsForm({ onSubmit }: { onSubmit: (values: z.infer<typeof formSchema>) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      manualCountry: "",
      postalCode: "",
      landmark: "",
      mobileNumber: "",
    },
  });

  const [showMap, setShowMap] = useState(false);
  const country = form.watch("country");

  const handleUseLocation = () => {
    setShowMap(true);
  };

  const handleLocationSelect = (address: any) => {
    const { city, town, village, state, country, country_code, postcode } = address;
    form.setValue("city", city || town || village || "");
    form.setValue("state", state || "");
    const found = countries.find(
      c => c.label.toLowerCase() === (country || "").toLowerCase() ||
        c.value === (country_code || "").toLowerCase()
    );
    form.setValue("country", found ? found.value : "other");
    if (!found && country) {
      form.setValue("manualCountry", country);
    }
    form.setValue("postalCode", postcode || "");
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const exported = {
      ...values,
      country: values.country === "other" ? values.manualCountry : countries.find(c => c.value === values.country)?.label || "",
    };
    onSubmit(exported);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-playfair text-xl font-bold text-primary">
              International Delivery
            </h2>
          </div>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 mb-2"
            onClick={handleUseLocation}
          >
            <Locate className="w-4 h-4" /> Use My Location
          </Button>
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the recipient's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={(v) => {
                  field.onChange(v);
                  if (v !== "other") form.setValue("manualCountry", "");
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {country === "other" && (
            <FormField
              control={form.control}
              name="manualCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                    <Input placeholder="Enter your city" {...field} />
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
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state/province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal/ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal/ZIP code" {...field} />
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
                    <Input 
                      type="tel" 
                      placeholder="Enter number with country code" 
                      {...field} 
                    />
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
      {showMap && (
        <SelectLocationMap
          onClose={() => setShowMap(false)}
          onSelect={handleLocationSelect}
        />
      )}
    </>
  );
}
