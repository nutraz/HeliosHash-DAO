import Prim "mo:prim";

actor Cache {
  stable var cache : [(Text, Text)] = [];

  public func set(key: Text, value: Text) : async () {
    cache := Array.filter<(Text, Text)>(cache, func ((k, _)) { k != key });
    cache := Array.append(cache, [(key, value)]);
  };

  public query func get(key: Text) : async ?Text {
    for ((k, v) in cache.vals()) {
      if (k == key) return ?v;
    };
    null
  };

  public func clear(key: Text) : async () {
    cache := Array.filter<(Text, Text)>(cache, func ((k, _)) { k != key });
  };

  public func clearAll() : async () {
    cache := [];
  };
}
