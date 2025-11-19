import Result "mo:base/Result";

module {
  public type CustomError = {
    #Unauthorized;
    #NotFound : Text;
    #InvalidInput : Text;
    #SystemError : Text;
    #InsufficientBalance;
    #ProposalExpired;
    #VoteAlreadyCast;
    #QuorumNotMet;
    #CycleLimitExceeded;
  };

  public func errorMessage(err : CustomError) : Text {
    switch (err) {
      case (#Unauthorized) "Unauthorized access";
      case (#NotFound(msg)) "Not found: " # msg;
      case (#InvalidInput(msg)) "Invalid input: " # msg;
      case (#SystemError(msg)) "System error: " # msg;
      case (#InsufficientBalance) "Insufficient balance";
      case (#ProposalExpired) "Proposal has expired";
      case (#VoteAlreadyCast) "Vote already cast";
      case (#QuorumNotMet) "Quorum not met";
      case (#CycleLimitExceeded) "Cycle limit exceeded";
    };
  };

  // Helper functions for common error patterns
  public func toResult<T>(value : ?T, error : CustomError) : Result.Result<T, Text> {
    switch (value) {
      case (?v) { #ok(v) };
      case null { #err(errorMessage(error)) };
    };
  };

  public func requireAuth(caller : Principal, authorized : Principal) : Result.Result<(), Text> {
    if (caller == authorized) {
      #ok(())
    } else {
      #err(errorMessage(#Unauthorized))
    };
  };

  public func validateNotEmpty(text : Text, fieldName : Text) : Result.Result<(), Text> {
    if (text == "") {
      #err(errorMessage(#InvalidInput(fieldName # " cannot be empty")))
    } else {
      #ok(())
    };
  };

  public func validatePositive(amount : Nat, fieldName : Text) : Result.Result<(), Text> {
    if (amount == 0) {
      #err(errorMessage(#InvalidInput(fieldName # " must be positive")))
    } else {
      #ok(())
    };
  };
};