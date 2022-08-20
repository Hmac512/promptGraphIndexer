import { BigInt } from "@graphprotocol/graph-ts";
import {
  Identity,
  ChangedBLSPublicKey,
  ChangedPublicKey,
  MintCredential,
  MintVerification,
  OwnershipTransferred,
} from "../generated/Identity/Identity";
import {
  Credential,
  Verification,
  IssuerPublicKeys,
} from "../generated/schema";

export function handleChangedBLSPublicKey(event: ChangedBLSPublicKey): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let publicKey = IssuerPublicKeys.load("0");
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!publicKey) {
    publicKey = new IssuerPublicKeys("0");
  }
  publicKey.BLSPublicKey = event.params.blsPublicKey;
  publicKey.save();
}

export function handleChangedPublicKey(event: ChangedPublicKey): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let publicKey = IssuerPublicKeys.load("0");
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!publicKey) {
    publicKey = new IssuerPublicKeys("0");
  }
  publicKey.PublicKey = event.params.publicKey;
  publicKey.save();
}

export function handleMintCredential(event: MintCredential): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  const credentialId = event.params.credentialId.toHexString();

  let credential = new Credential(credentialId);
  credential.encryptedDocument = event.params.encryptedDocument;
  credential.credentialHolderPublicKey = event.params.holderPublicKey;
  credential.timestamp = event.params.timestamp.times(BigInt.fromI32(1000));
  // Entities can be written to the store with `.save()`
  credential.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.blsPublicKey(...)
  // - contract.credentials(...)
  // - contract.getCredentialOwnerPublicKey(...)
  // - contract.getLatestVerification(...)
  // - contract.owner(...)
  // - contract.verifications(...)
}

export function handleMintVerification(event: MintVerification): void {
  const verificationId = event.params.verificationId.toHexString();
  const credentialId = event.params.credentialId.toHexString();
  const previouseVerificationId = event.params.previousVerification.toHexString();
  const credential = Credential.load(credentialId);
  if (!credential) return;
  const verification = new Verification(verificationId);
  verification.credential = credentialId;
  verification.previousVerification = previouseVerificationId;
  verification.encryptedDocument = event.params.encryptedDocument;
  verification.verifierPublicKeyHash = event.params.verifierPublicKeyHash.toHexString();
  verification.timestamp = event.params.timestamp.times(BigInt.fromI32(1000));
  credential.latestVerification = verificationId;
  verification.save();
  credential.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
