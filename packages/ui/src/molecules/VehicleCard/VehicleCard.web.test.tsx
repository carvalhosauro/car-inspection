import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleCard } from "./VehicleCard.web";

describe("VehicleCard (web)", () => {
  const props = {
    plate: "ABC1D23",
    model: "Onix 1.0",
    year: 2022,
    km: 45000,
    status: "em-andamento" as const,
    progress: 65,
  };
  it("renders plate, model and year", () => {
    render(<VehicleCard {...props} />);
    expect(screen.getByText("ABC1D23")).toBeInTheDocument();
    expect(screen.getByText("Onix 1.0")).toBeInTheDocument();
    expect(screen.getByText(/2022/)).toBeInTheDocument();
  });
  it("renders formatted km", () => {
    render(<VehicleCard {...props} />);
    expect(screen.getByText("45.000 km")).toBeInTheDocument();
  });
  it("renders the status badge", () => {
    render(<VehicleCard {...props} />);
    expect(screen.getByText("Em andamento")).toBeInTheDocument();
  });
  it("renders a progressbar reflecting progress", () => {
    render(<VehicleCard {...props} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "65");
  });
  it("renders the optional vehicle image when imageUrl is provided", () => {
    render(<VehicleCard {...props} imageUrl="https://example.com/car.jpg" />);
    const img = screen.getByRole("img", { name: "Veículo ABC1D23" });
    expect(img).toHaveAttribute("src", "https://example.com/car.jpg");
  });
  it("invokes onPress when the card is activated", () => {
    const onPress = vi.fn();
    render(<VehicleCard {...props} onPress={onPress} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
