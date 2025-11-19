import Prim "mo:prim";
import Result "mo:base/Result";

public type User = {
  id: Text;
  kyc_hash: Text;
  roles: [Text];
  wallet_address: Text;
  metadata: ?Text;
  kyc_verified: Bool;
};

actor class UserRegistry() = this {
  public func register_user(kyc_hash: Text, role: Text, wallet_address: Text): async Result.Result<User, Text> { /* ... */ };
  public func update_profile(user_id: Text, metadata: Text): async Result.Result<User, Text> { /* ... */ };
  public func verify_kyc(user_id: Text, onfido_check_id: Text): async Result.Result<Bool, Text> { /* ... */ };
  public func assign_role(user_id: Text, role_type: Text, admin_signature: Text): async Result.Result<User, Text> { /* ... */ };
  public func get_user(user_id: Text): async Result.Result<User, Text> { /* ... */ };
  public func list_users(filter: ?Text, page: Nat, page_size: Nat): async Result.Result<[User], Text> { /* ... */ };
  public func revoke_membership(user_id: Text, reason: Text): async Result.Result<Bool, Text> { /* ... */ };
};
