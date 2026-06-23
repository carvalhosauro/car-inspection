import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoleGate } from "./role-gate";

describe("RoleGate", () => {
  it("renders children when can(role, action) is true", () => {
    render(
      <RoleGate role="gestor" action="manageUsers">
        <span>allowed content</span>
      </RoleGate>,
    );
    expect(screen.getByText("allowed content")).toBeInTheDocument();
  });

  it("renders fallback when can(role, action) is false", () => {
    render(
      <RoleGate role="vistoriador" action="manageUsers" fallback={<span>no access</span>}>
        <span>allowed content</span>
      </RoleGate>,
    );
    expect(screen.queryByText("allowed content")).toBeNull();
    expect(screen.getByText("no access")).toBeInTheDocument();
  });

  it("renders nothing (not children) for a denied action with no fallback prop", () => {
    const { container } = render(
      <RoleGate role="vistoriador" action="crudVehicles">
        <span>allowed content</span>
      </RoleGate>,
    );
    expect(screen.queryByText("allowed content")).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it("renders children for supervisor with crudVehicles permission", () => {
    render(
      <RoleGate role="supervisor" action="crudVehicles">
        <span>supervisor content</span>
      </RoleGate>,
    );
    expect(screen.getByText("supervisor content")).toBeInTheDocument();
  });

  it("renders null fallback by default when denied", () => {
    const { container } = render(
      <RoleGate role="superadmin" action="manageUsers">
        <span>admin only</span>
      </RoleGate>,
    );
    expect(screen.queryByText("admin only")).toBeNull();
    expect(container.firstChild).toBeNull();
  });
});
