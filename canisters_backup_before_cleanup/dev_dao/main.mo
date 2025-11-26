actor DevDAO {
  public query func get_projects() : async [({ id : Nat; name : Text; stage : Text; completion : Nat; funding : Text; isLive : Bool })] {
    return [
      { id = 1; name = "Solar Bitcoin Mining Hub"; stage = "functioning"; completion = 100; funding = "₹2.5 Cr"; isLive = true },
      { id = 6; name = "Helios#Baghpat Village DAO"; stage = "functioning"; completion = 100; funding = "₹85L"; isLive = true },
      { id = 7; name = "UrgamU Delhi Solar Mining"; stage = "functioning"; completion = 100; funding = "₹65L"; isLive = true }
    ];
  };

  public query func get_user() : async ({ name : Text; pfp : Text; rank : Text; tokenBalance : Nat }) {
    return { name = "Rahul Kumar"; pfp = "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"; rank = "Investor & Collaborator"; tokenBalance = 15000 };
  };
};
