persistent actor DevDao {
  public query func get_version() : async Text {
    return "HeliosHash DAO v1.0";
  };
  
  public query func get_projects() : async [Project] {
    return [
      { id = 1; name = "Helios#Baghpat"; stage = "functioning"; funding = "₹85L"; completion = 100; is_live = true; },
      { id = 2; name = "Solar Bitcoin Hub"; stage = "functioning"; funding = "₹2.5 Cr"; completion = 100; is_live = true; }
    ];
  };
  
  type Project = {
    id : Nat;
    name : Text;
    stage : Text;
    funding : Text;
    completion : Nat;
    is_live : Bool;
  };
}
