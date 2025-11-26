import Debug "mo:base/Debug";

// Minimal assertion helper used by local tests. We avoid depending on mo:base/Assert
public func fail(msg : Text) : () { Debug.trap(msg) };

public func assert(cond : Bool, msg : Text) : () {
  if (not cond) { Debug.trap(msg) } else { () };
};
