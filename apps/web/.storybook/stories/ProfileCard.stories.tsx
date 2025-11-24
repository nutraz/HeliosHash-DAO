import React from "react";
import { Meta, Story } from "@storybook/react";
import ProfileCard, { ProfileCardProps } from "@/components/dashboard/ProfileCard";

export default {
  title: "Dashboard/ProfileCard",
  component: ProfileCard,
} as Meta;

const Template: Story<ProfileCardProps> = (args) => <ProfileCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Dharmendra Sharma",
  roleTags: ["Landowner", "Validator"],
  level: 3,
  reputation: 720,
  badges: ["KYC Verified", "Validator"],
};
