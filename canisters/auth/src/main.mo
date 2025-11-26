persistent actor Auth {
  public query func whoami() : async Text { return "auth"; };
}
