import init, {
  create_mint_transaction,
  create_ztransfer_transaction,
  create_burn_transaction,
  decrypt_transaction,
  create_key,
  note_commitment,
  note_nullifier
} from "./sapling.js";

export const zeos_create_mint_transaction = async function(params_bytes, addr_json, tx_r_json, eos_username)
{
  var res;
  await init().then(() => {
      res = create_mint_transaction(params_bytes, addr_json, tx_r_json, eos_username)
  });
  return res;
}
export const zeos_create_ztransfer_transaction = async function(params_bytes, secret_key, tx_s_json, tx_r_json, auth_path_v_json, auth_path_b_json)
{
  var res;
  await init().then(() => {
      res = create_ztransfer_transaction(params_bytes, secret_key, tx_s_json, tx_r_json, auth_path_v_json, auth_path_b_json)
  });
  return res;
}
export const zeos_create_burn_transaction = async function(params_bytes, secret_key, tx_s_json, quantity_json, auth_path_v_json, auth_path_b_json, eos_username)
{
  var res;
  await init().then(() => {
      res = create_burn_transaction(params_bytes, secret_key, tx_s_json, quantity_json, auth_path_v_json, auth_path_b_json, eos_username)
  });
  return res;
}
export const zeos_decrypt_transaction = async function(sk, enc_tx_json)
{
  var res;
  await init().then(() => {
      res = decrypt_transaction(sk, enc_tx_json)
  });
  return res;
}
export const zeos_create_key = async function(seed)
{
  var res;
  await init().then(() => {
      res = create_key(seed)
  });
  return res;
}
export const zeos_note_commitment = async function(note_json, h_sk)
{
  var res;
  await init().then(() => {
      res = note_commitment(note_json, h_sk)
  });
  return res;
}
export const zeos_note_nullifier = async function(note_json, sk)
{
  var res;
  await init().then(() => {
      res = note_nullifier(note_json, sk)
  });
  return res;
}
