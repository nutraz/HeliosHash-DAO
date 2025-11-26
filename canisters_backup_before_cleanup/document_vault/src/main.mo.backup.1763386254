import Prim "mo:prim";
import Result "mo:base/Result";

public type DocumentMetadata = {
  id: Text;
  owner_id: Text;
  doc_type: Text;
  metadata: ?Text;
};

actor class DocumentVault() = this {
  public func upload_document(user_id: Text, doc_type: Text, encrypted_data: Blob, metadata: Text): async Result.Result<Text, Text> { /* ... */ };
  public func share_document(doc_id: Text, recipient_id: Text, expiry_timestamp: Nat64): async Result.Result<Bool, Text> { /* ... */ };
  public func revoke_access(doc_id: Text, recipient_id: Text): async Result.Result<Bool, Text> { /* ... */ };
  public func get_document(doc_id: Text, requesting_user_id: Text): async Result.Result<Blob, Text> { /* ... */ };
  public func list_documents(user_id: Text, filter: ?Text): async Result.Result<[DocumentMetadata], Text> { /* ... */ };
  public func delete_document(doc_id: Text, owner_signature: Text): async Result.Result<Bool, Text> { /* ... */ };
};
