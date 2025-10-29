import Text "mo:base/Text";

// Minimal persistent actor providing trivial query entrypoints.
persistent actor MinimalTest {
  public query func runBasicTest() : async Text {
    "Minimal test ok"
  };

  public query func runEcho(msg : Text) : async Text {
    msg
  };
};
