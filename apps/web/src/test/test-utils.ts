import { fireEvent, screen } from "@testing-library/react";

export const switchTab = async (tabName: string) => {
  const tab = screen.getByRole("tab", { name: new RegExp(tabName, "i") });
  fireEvent.click(tab);
};
