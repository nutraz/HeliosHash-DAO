import Prim "mo:prim";

actor ProjectFunding {
  // Example: Project structure
  type Project = {
    id: Nat;
    name: Text;
    fundingGoal: Nat;
    funded: Nat;
  };

  stable var projects: [Project] = [];

  public func createProject(name: Text, fundingGoal: Nat): async Nat {
    let id = projects.size();
    let project = { id; name; fundingGoal; funded = 0 };
    projects := Array.append(projects, [project]);
    id
  };

  public query func getProjects(): async [Project] {
    projects
  };
}
