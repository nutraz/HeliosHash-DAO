"use client";

import AnimalCareForm from "@/components/community/AnimalCareForm";
import JobBoard from "@/components/community/opportunities/JobBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CommunityPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Community Initiatives</h1>

      <Tabs defaultValue="animal-care" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="animal-care">Animal Care</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="animal-care" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Animal Care Initiative</h2>
              <p className="text-gray-600 mb-6">
                Support local animal welfare through community-driven initiatives.
              </p>
            </div>
            <AnimalCareForm />
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <JobBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
