// Absolute simplest canister - should work everywhere
persistent actor Main {
  public func hello() : async Text {
    return "Hello, World!";
  };
}
