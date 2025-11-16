import Text "mo:base/Text";

// Minimal module providing trivial test functions — made a module so the
// main anonymous test actor remains the single actor in this compilation.
module MinimalTest {
  public func runBasicTest() : Text {
    "Minimal test ok"
  };

  public func runEcho(msg : Text) : Text {
    msg
  };
};
