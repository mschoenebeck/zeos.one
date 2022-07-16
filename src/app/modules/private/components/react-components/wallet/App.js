import * as React from 'react'
import { useState, useEffect } from 'react'

import { Ledger } from 'ual-ledger'
import { Lynx } from 'ual-lynx'
//import { Scatter } from 'ual-scatter'
import { Anchor } from 'ual-anchor'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
import { JsonRpc, Api } from 'eosjs'
import { createClient } from "@liquidapps/dapp-client";
import { Asset } from '@greymass/eosio'
import { saveAs } from 'file-saver';
import { base58_to_binary } from 'base58-js'

import KeyManagement from './KeyManagement'
import UALLogin from './UALLogin'
import TransactionInterface from './TransactionInterface'
import TransactionHistory from './TransactionHistory'
import Header from './Header'
import Logger from './Logger'

import { Button, InputLabel } from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { zeos_create_key } from './RustWasm'

const theme = createTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    fontFamily: "Nerd",
    fontSize: 16
  },
  overrides:{
    MuiButton:{
      contained:{
        color: 'black',
        backgroundColor: 'darkgrey',
        '&:hover': {
          backgroundColor: 'lightgrey',
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: 'darkgrey',
          },
        }
      }
    }
  }
});

const EOSTransaction = {
  actions: [{
      account: 'thezeostoken',
      name: '',
      authorization: [{
          actor: '',
          permission: 'active',
      }],
      data: null,
  }],
}

// NOTE: must have DSP node at the top (or actually only containing DSPs at all)
const kylinTestnet = {
  chainId: "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "kylin-dsp-1.liquidapps.io",
      port: 443,
    },
    {
      protocol: "http",
      host: "kylin.eosn.io",
      port: 80,
    }
  ]
}


// must have format: "123.1234 SYM"
function str2Asset(str, considerDecimalsInSymbolCode = true)
{
  let dot = str.indexOf(".");
  let ws = str.indexOf(" ")
  let num_decimals = str.substr(dot+1, ws - (dot+1)).length;
  let amt = parseInt(str.substr(0, ws).replace(".", ""), 10);
  let sym_str = str.substr(ws+1)
  if(sym_str.length > 5)
  {
    console.log("JS 53 bit int limitation limits the max length of SYM NAME to 5 letters")
    return null;
  }
  if(considerDecimalsInSymbolCode)
  {
    var sym_code = num_decimals;
    for(let i = 0; i < sym_str.length; i++)
    {
      sym_code += sym_str.charCodeAt(i) * 2**((i+1)*8);
    }
  }
  else
  {
    var sym_code = 0;
    for(let i = 0; i < sym_str.length; i++)
    {
      sym_code += sym_str.charCodeAt(i) * 2**(i*8);
    }
  }
  return {
    amount: amt,
    symbol: {
      code: sym_code,
      decimals: num_decimals,
      name: sym_str
    }
  };
}

const App = () =>
{
  // set state variables that define wallet state (i.e. those that will be stored in wallet file)
  const [keyPairs, setKeyPairs] = useState([]);
  const [selectedKey, setSelectedKey] = useState(-1);
  // status of UAL Logins (won't be saved to wallet file)
  const [activeUser, setActiveUser] = useState(null);
  const [activeZUser, setActiveZUser] = useState(null);
  const [username, setUsername] = useState("");
  const [zUsername, setZUsername] = useState("");
  const [zeosBalance, setZeosBalance] = useState(0);
  const [zZeosBalance, setZZeosBalance] = useState(0);
  // TODO: make array of RPC's and chose randomly for each request
  const [rpc, setRPC] = useState(new JsonRpc(kylinTestnet.rpcEndpoints[0].protocol + "://" + kylinTestnet.rpcEndpoints[0].host + ":" + kylinTestnet.rpcEndpoints[0].port));
  // Session Logs
  const [logs, setLogs] = useState(["Welcome to the ZEOS Protocol Demo!"]);

  function _log(obj)
  {
    console.log(obj);
    let str = ('object' === typeof yourVariable) ? JSON.stringify(obj) : obj;
    setLogs([...logs, str]);
  }

  function cpy2cb(obj)
  {
    navigator.clipboard.writeText(obj).then(function() {
      _log('copied to clipboard!');
    }, function(err) {
        console.error('Error: ', err);
    });
  }

  async function onCreateNewKey(sk = [])
  {
    // can create randomness here in JS or in RUST by passing an empty seed
    //var seed = Array.from({length: 32}, () => Math.floor(Math.random() * 256))
    var kp = JSON.parse(await zeos_create_key(sk))
    kp.id  = keyPairs.length
    kp.gs_tx_count = 0;
    kp.gs_mt_leaf_count = 0;
    kp.gs_mt_depth = 0;
    kp.transactions = [];
    kp.spentNotes = [];
    kp.unspentNotes = [];
    document.getElementById("key-select").value = kp.id
    setKeyPairs([...keyPairs, kp])
    setSelectedKey(kp.id)
    _log("new random key created")
  }

  async function onImportKey()
  {
    // TODO: check for valid input string
    var sk = base58_to_binary(document.getElementById("key-input").value.substring(1));
    if(32 !== sk.length) return;
    for(const kp of keyPairs)
    {
      if(sk.every(function(v, i) {return v === kp.sk[i]}))
      {
        alert('key pair already exists!');
        return;
      }
    }
    await onCreateNewKey(sk);
  }

  function onKeySelect(e)
  {
    setSelectedKey(e.target.value)
  }

  function onDeleteKey()
  {
    var newKeyPairs = keyPairs.filter((kp) => {return(kp.id != selectedKey)})
    setKeyPairs(newKeyPairs)
    document.getElementById("key-select").value = newKeyPairs.length-1
    setSelectedKey(newKeyPairs.length-1)
  }

  async function onMint()
  {
    // input parameters of TransactionInterface components are checked inside the component
    var amt_str = document.getElementById("mint-amount-number").value;
    var amt_sym = document.getElementById("mint-amount-select").innerHTML;
    var qty = str2Asset(amt_str + ' ' + amt_sym, true);
    var addr = base58_to_binary(document.getElementById("mint-to").value.substring(1));
    var h_sk = addr.slice(0, 32);
    var pk = addr.slice(32, 64);
    var utf8Encode = new TextEncoder();
    var mm_ = utf8Encode.encode(document.getElementById("mint-memo").value);
    var mm = new Array(32).fill(0); for(let i = 0; i < mm_.length; i++) { mm[i] = mm_[i]; }
    // check if EOS account is connected
    if(!activeUser)
    {
      alert('Please log into your EOS account first');
      return;
    }
    var eos_user = await activeUser.getAccountName();
    // check if params file is selected
    if(0 === document.getElementById('mint-params').files.length)
    {
      alert('No params file selected');
      return;
    }

    _log('Create Mint Transaction... This may take up to several minutes (will be improved in the future). Please wait patiently.');

    // read Params file (actual execution below 'fr.onload' function definition)
    var fr = new FileReader();
    fr.onload = async function()
    {
      // receive byte array containing mint params from file
      var mint_params = new Uint8Array(fr.result);

      var mint_addr = {
        h_sk: Array.from(h_sk),
        pk: Array.from(pk)
      };

      // create TxReceiver part only
      var mint_tx_r = {
        notes: [
          {
            quantity: { amount: qty.amount, symbol: qty.symbol.code },
            rho: Array.from({length: 32}, () => Math.floor(Math.random() * 256))
          },
        ],
        memo: Array.from(mm)
      };

      var json = await zeos_create_mint_transaction(mint_params,
                                                    JSON.stringify(mint_addr),
                                                    JSON.stringify(mint_tx_r),
                                                    eos_user);
      //_log(json);

      // UAL sign EOS transaction json
      try
      {
        EOSTransaction.actions[0].name = 'mint';
        EOSTransaction.actions[0].data = JSON.parse(json);
        EOSTransaction.actions[0].authorization[0].actor = eos_user;
        console.log(EOSTransaction);
        _log('Create Mint Transaction... done!');
        _log("Push Mint Transaction...");
        let res = await activeUser.signTransaction(EOSTransaction, { broadcast: true });
        _log("Push Mint Transaction... " + res.status + "! Transaction ID: " + res.transactionId);
      }
      catch(error)
      {
        _log("Push Mint Transaction... " + error);
      }
    };
    fr.readAsArrayBuffer(document.getElementById('mint-params').files[0]);
  }

  async function getMTNodeValue(idx)
  {
    try
      {
        let json = await rpc.get_table_rows({
          code: "thezeostoken",
          scope: "thezeostoken",
          table: "mteosram",
          lower_bound: idx,
          upper_bound: idx,
          limit: 1,
          json: true
        });

        if(0 === json.rows.length)
          return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        for (var bytes = [], c = 0; c < json.rows[0].val.length; c += 2)
          bytes.push(parseInt(json.rows[0].val.substr(c, 2), 16));

        return bytes;
      }
      catch(e) { console.warn(e); return; }
  }

  // see equivalent C macros in thezeostoken.cpp
  function MT_ARR_LEAF_ROW_OFFSET(d) { return ((2**(d)) - 1) }
  function MT_ARR_FULL_TREE_OFFSET(d){ return ((2**((d)+1)) - 1) }
  function MT_NUM_LEAVES(d) { return (2**(d)) }
  async function getAuthPath(arr_idx)
  {
    let auth_path_v = [];
    let auth_path_b = [];
    let tree_idx = Math.floor(arr_idx / MT_ARR_FULL_TREE_OFFSET(keyPairs[selectedKey].gs_mt_depth));
    let tos = tree_idx * MT_ARR_FULL_TREE_OFFSET(keyPairs[selectedKey].gs_mt_depth);
    for(let d = keyPairs[selectedKey].gs_mt_depth, idx = arr_idx - tos; d > 0; d--)
    {
      // if array index of node is uneven it is always the left child
      let is_left_child = (1 == idx % 2);
      // determine sister node
      let sis_idx = is_left_child ? idx + 1 : idx - 1;
      // get sister value
      let sis_val = await getMTNodeValue(tos + sis_idx);
      // add pair to array
      let sis = {val: sis_val, is_right: !is_left_child};
      auth_path_v.push(sis.val);
      auth_path_b.push(sis.is_right);
      // set idx to parent node index:
      // left child's array index divided by two (integer division) equals array index of parent node
      idx = is_left_child ? Math.floor(idx / 2) : Math.floor(sis_idx / 2);
    }
    let res = {auth_path_v: auth_path_v, auth_path_b: auth_path_b};
    //console.log(res);
    return res;
  }

  async function onZTransfer()
  {
    // input parameters of TransactionInterface components are checked inside the component
    var amt_str = document.getElementById("ztransfer-amount-number").value;
    var amt_sym = document.getElementById("ztransfer-amount-select").innerHTML;
    var qty = str2Asset(amt_str + ' ' + amt_sym, true);
    var addr = base58_to_binary(document.getElementById("ztransfer-to").value.substring(1));
    var h_sk = addr.slice(0, 32);
    var pk = addr.slice(32, 64);
    var utf8Encode = new TextEncoder();
    var mm_ = utf8Encode.encode(document.getElementById("ztransfer-memo").value) ;
    var mm = new Array(32).fill(0); for(let i = 0; i < mm_.length; i++) { mm[i] = mm_[i]; }
    // check if EOS account is connected
    if(!activeZUser)
    {
      alert('Please log into your EOS account FOR PRIVATE TRANSACTIONS first');
      return;
    }
    var eos_user = await activeZUser.getAccountName();
    // check if params file is selected
    if(0 === document.getElementById('ztransfer-params').files.length)
    {
      alert('No params file selected');
      return;
    }
    // check if a key pair exists/is selected
    if(-1 === selectedKey)
    {
      alert('No Key Pair selected');
      return;
    }

    _log('Create ZTransfer Transaction... This may take up to several minutes (will be improved in the future). Please wait patiently.');

    // find note to transfer: choose the smallest necessary but not bigger than needed
    // TODO: later spent_note will become an array to allow for more than one note to spend at a time
    var spent_note = null;
    for(const n of keyPairs[selectedKey].unspentNotes)
    {
      // since unspentNotes is sorted just choose the next bigger equal one
      if(n.quantity.amount >= qty.amount)
      {
        // clone object here because of delete calls further below
        spent_note = structuredClone(n);
        // get merkle tree auth path of spent_note
        // TODO: later auth_path will become an array of auth paths to allow for more than one note to spend at a time
        var auth_pair = await getAuthPath(spent_note.mt_arr_idx);
        // remove some properties to match rustzeos' Note struct
        delete spent_note.commitment;
        delete spent_note.nullifier;
        delete spent_note.mt_leaf_idx;
        delete spent_note.mt_arr_idx;
        break;
      }
    }
    if(null === spent_note)
    {
      _log("Error: no note big enough available.")
      return;
    }

    // read Params file (actual execution below 'fr.onload' function definition)
    var fr = new FileReader();
    fr.onload = async function()
    {
      // receive byte array containing ztransfer params from file
      var ztransfer_params = new Uint8Array(fr.result);

      // create TxSender part
      var ztransfer_tx_s = {
        notes: [spent_note],
        change: {
          quantity: { amount: (spent_note.quantity.amount - qty.amount), symbol: qty.symbol.code },
          rho: Array.from({length: 32}, () => Math.floor(Math.random() * 256))
        },
        esk_s: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        esk_r: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        addr_r: {
          h_sk: Array.from(h_sk),
          pk: Array.from(pk)
        }
      };
      // create TxReceiver part
      var ztransfer_tx_r = {
        notes: [
          {
            quantity: { amount: qty.amount, symbol: qty.symbol.code },
            rho: Array.from({length: 32}, () => Math.floor(Math.random() * 256))
          },
        ],
        memo: Array.from(mm)
      };

      var json = await zeos_create_ztransfer_transaction(ztransfer_params,
                                                         keyPairs[selectedKey].sk,
                                                         JSON.stringify(ztransfer_tx_s),
                                                         JSON.stringify(ztransfer_tx_r),
                                                         JSON.stringify(auth_pair.auth_path_v),
                                                         JSON.stringify(auth_pair.auth_path_b));
      //_log(json);

      // UAL sign json transaction
      try
      {
        EOSTransaction.actions[0].name = 'ztransfer';
        EOSTransaction.actions[0].data = JSON.parse(json);
        EOSTransaction.actions[0].authorization[0].actor = eos_user;
        console.log(EOSTransaction);
        _log('Create ZTransfer Transaction... done!');
        _log("Push ZTransfer Transaction...");
        let res = await activeZUser.signTransaction(EOSTransaction, { broadcast: true });
        _log("Push ZTransfer Transaction... " + res.status + "! Transaction ID: " + res.transactionId);
      }
      catch(error)
      {
        _log("Push ZTransfer Transaction... " + error);
      }
    };
    fr.readAsArrayBuffer(document.getElementById('ztransfer-params').files[0]);
  }

  async function onBurn()
  {
    // input parameters of TransactionInterface components are checked inside the component
    var amt_str = document.getElementById("burn-amount-number").value;
    var amt_sym = document.getElementById("burn-amount-select").innerHTML;
    var qty = str2Asset(amt_str + ' ' + amt_sym, true);
    var eos_account = document.getElementById("burn-to").value;
    var utf8Encode = new TextEncoder();
    var mm_ = utf8Encode.encode(document.getElementById("burn-memo").value);
    var mm = new Array(32).fill(0); for(let i = 0; i < mm_.length; i++) { mm[i] = mm_[i]; }
    // check if EOS account is connected
    if(!activeUser)
    {
      alert('Please log into your EOS account first');
      return;
    }
    var eos_user = await activeUser.getAccountName();
    // check if params file is selected
    if(0 === document.getElementById('burn-params').files.length)
    {
      alert('No params file selected');
      return;
    }
    // check if a key pair exists/is selected
    if(-1 === selectedKey)
    {
      alert('No Key Pair selected');
      return;
    }

    _log('Create Burn Transaction... This may take up to several minutes (will be improved in the future). Please wait patiently.');

    // find note to transfer: choose the smallest necessary but not bigger than needed
    // TODO: later spent_note will become an array to allow for more than one note to spend at a time
    var spent_note = null;
    for(const n of keyPairs[selectedKey].unspentNotes)
    {
      // since unspentNotes is sorted just choose the next bigger equal one
      if(n.quantity.amount >= qty.amount)
      {
        // clone object here because of delete calls further below
        spent_note = structuredClone(n);
        // get merkle tree auth path of spent_note
        // TODO: later auth_path will become an array of auth paths to allow for more than one note to spend at a time
        var auth_pair = await getAuthPath(spent_note.mt_arr_idx);
        // remove some properties to match rustzeos' Note struct
        delete spent_note.commitment;
        delete spent_note.nullifier;
        delete spent_note.mt_leaf_idx;
        delete spent_note.mt_arr_idx;
        break;
      }
    }
    if(null === spent_note)
    {
      _log("Error: no note big enough available.")
      return;
    }

    // read Params file (actual execution below 'fr.onload' function definition)
    var fr = new FileReader();
    fr.onload = async function()
    {
      // receive byte array containing burn params from file
      var burn_params = new Uint8Array(fr.result);

      // create TxSender part only
      var burn_tx_s = {
        notes: [spent_note],
        change: {
          quantity: { amount: (spent_note.quantity.amount - qty.amount), symbol: qty.symbol.code },
          rho: Array.from({length: 32}, () => Math.floor(Math.random() * 256))
        },
        esk_s: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        esk_r: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        addr_r: {
          h_sk: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          pk: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        }
      };

      var quantity = { amount: qty.amount, symbol: qty.symbol.code }

      var json = await zeos_create_burn_transaction(burn_params,
                                                    keyPairs[selectedKey].sk,
                                                    JSON.stringify(burn_tx_s),
                                                    JSON.stringify(quantity),
                                                    JSON.stringify(auth_pair.auth_path_v),
                                                    JSON.stringify(auth_pair.auth_path_b),
                                                    eos_account);
      //_log(json);

      // UAL sign json transaction
      try
      {
        EOSTransaction.actions[0].name = 'burn';
        EOSTransaction.actions[0].data = JSON.parse(json);
        EOSTransaction.actions[0].authorization[0].actor = eos_user;
        console.log(EOSTransaction);
        _log('Create Burn Transaction... done!');
        _log("Push Burn Transaction...");
        let res = await activeUser.signTransaction(EOSTransaction, { broadcast: true });
        _log("Push Burn Transaction... " + res.status + "! Transaction ID: " + res.transactionId);
      }
      catch(error)
      {
        _log("Push Burn Transaction... " + error);
      }
    };
    fr.readAsArrayBuffer(document.getElementById('burn-params').files[0]);
  }

  async function isNoteNullified(note)
  {
    // only first 4 bytes to match uint64_t table index
    let idx = parseInt(note.nullifier.substr(6, 2) + note.nullifier.substr(4, 2) + note.nullifier.substr(2, 2) + note.nullifier.substr(0, 2), 16)

    try
      {
        let json = await rpc.get_table_rows({
          code: "thezeostoken",
          scope: "thezeostoken",
          table: "nfeosram",
          lower_bound: idx,
          upper_bound: idx,
          limit: 1,
          json: true
        });

        if(0 === json.rows.length)
          return false;

        return true;
      }
      catch(e) { console.warn(e); return; }
  }

  async function getZeosAccountBalance(eosAccountName)
  {
    try
      {
        let json = await rpc.get_table_rows({
          code: "thezeostoken",
          scope: eosAccountName,
          table: "accounts",
          lower_bound: 1397704026, // 1397704026 why this one (without decimals)
          upper_bound: 1397704026, // 357812230660 and not this one?
          limit: 1,
          json: true
        });

        if(0 === json.rows.length)
          return 0;

        return json.rows[0].balance;
      }
      catch(e) { console.warn(e); return; }
  }

  function getZeosWalletBalance()
  {
    if(-1 === selectedKey || selectedKey >= keyPairs.length)
    {
      return 0;
    }
    let res = 0;
    for(const n of keyPairs[selectedKey].unspentNotes)
    {
      res += n.quantity.amount;
    }
    return res;
  }

  // sync wallet with global blockchain state
  // during this process no keys should be created/deleted
  // i.e. no other function should call setKeyPairs during that time
  async function onSync()
  {
    // update EOS account balances
    if(activeUser)
    {
      setZeosBalance(await getZeosAccountBalance(username));
    }
    if(activeZUser)
    {
      setZZeosBalance(await getZeosAccountBalance(zUsername));
    }

    // can only sync if there's a key selected
    if(-1 === selectedKey)
    {
      return;
    }

    _log("Syncing with EOS Blockchain...");

    try
    {
      // fetch global stats of contract
      var gs = (await rpc.get_table_rows({
        code: "thezeostoken",
        scope: "thezeostoken",
        table: "globalstats",
        lower_bound: 1,         // change to 0 if contract compiled with USE_VRAM set
        upper_bound: 1,         // change to 0 if contract compiled with USE_VRAM set
        json: true
      })).rows[0];
    }
    catch(e) { _log(e); return; }

    // bring selected key pair up to date
    let newKp = keyPairs[selectedKey];
    newKp.gs_mt_depth = gs.mt_depth;
    newKp.gs_mt_leaf_count = gs.mt_leaf_count;

    let num = gs.tx_count - newKp.gs_tx_count;
    if(0 === num)
    {
      _log('Syncing with EOS blockchain... done!');
      return;
    }

    // fetch all txs in chunks
    const chunkSize = 10;
    let newTxs = [];
    while(num > 0)
    {
      const sNum = num < chunkSize ? num : chunkSize;
      try
      {
        // fetch all new txs
        newTxs.push(...(await rpc.get_table_rows({
          code: "thezeostoken",
          scope: "thezeostoken",
          table: "txdeosram",
          lower_bound: newKp.gs_tx_count,
          upper_bound: newKp.gs_tx_count + sNum - 1,
          limit: sNum,
          json: true
        })).rows);
      }
      catch(e) { console.warn(e); return; }
      newKp.gs_tx_count += sNum;
      num -= sNum;
    }

    // for each tx
    for(const tx of newTxs)
    {
      // decrypt
      let enc_tx = structuredClone(tx);
      delete enc_tx.id;
      delete enc_tx.type;
      delete enc_tx.mt_leaf_count;
      var dec_tx = JSON.parse(await zeos_decrypt_transaction(newKp.sk, JSON.stringify(enc_tx)));
      dec_tx.id = tx.id;
      dec_tx.type = tx.type;
      dec_tx.mt_leaf_count = tx.mt_leaf_count;

      let newNotes = [];
      switch(tx.type)
      {
        // MINT
        case 1:
          if(dec_tx.receiver)
          {
            // add new note
            let note = dec_tx.receiver.notes[0];
            note.commitment = await zeos_note_commitment(JSON.stringify(note), newKp.addr.h_sk);
            note.nullifier = await zeos_note_nullifier(JSON.stringify(note), newKp.sk);
            note.mt_leaf_idx = tx.mt_leaf_count;
            note.mt_arr_idx = Math.floor(note.mt_leaf_idx/MT_NUM_LEAVES(gs.mt_depth)) * MT_ARR_FULL_TREE_OFFSET(gs.mt_depth) +
                              note.mt_leaf_idx % MT_NUM_LEAVES(gs.mt_depth) + MT_ARR_LEAF_ROW_OFFSET(gs.mt_depth);
            newNotes.push(note);
          }
          break;

        // ZTRANSFER
        case 2:
          if(dec_tx.sender)
          {
            // for each note in unspent notes check if it was spent
            for(let i = newKp.unspentNotes.length-1; i >= 0; i--)
            {
              // two notes are equal if rho is equal
              if(dec_tx.sender.notes[0].rho.every(function(v, x) {return v === newKp.unspentNotes[i].rho[x]}))
              {
                newKp.spentNotes.push(...newKp.unspentNotes.splice(i, 1));
              }
            }

            // add change note [TODO: in case of multiple notes bein sent: the biggest change note (i.e. the only one that is not zero) must come first!]
            let note = dec_tx.sender.change;
            note.commitment = await zeos_note_commitment(JSON.stringify(note), newKp.addr.h_sk);
            note.nullifier = await zeos_note_nullifier(JSON.stringify(note), newKp.sk);
            note.mt_leaf_idx = tx.mt_leaf_count + 1;
            note.mt_arr_idx = Math.floor(note.mt_leaf_idx/MT_NUM_LEAVES(gs.mt_depth)) * MT_ARR_FULL_TREE_OFFSET(gs.mt_depth) +
                              note.mt_leaf_idx % MT_NUM_LEAVES(gs.mt_depth) + MT_ARR_LEAF_ROW_OFFSET(gs.mt_depth);
            newNotes.push(note);

            // sender.sk/pk === recevier.sk/pk?
            if(dec_tx.sender.addr_r.pk.every(function(v, i) {return v === newKp.addr.pk[i]}))
            {
              for(let i = 0; i < dec_tx.receiver.notes.length; i++)
              {
                let note = dec_tx.receiver.notes[i];
                // get nullifier and commitment
                note.commitment = await zeos_note_commitment(JSON.stringify(note), newKp.addr.h_sk);
                note.nullifier = await zeos_note_nullifier(JSON.stringify(note), newKp.sk);
                note.mt_leaf_idx = tx.mt_leaf_count + i*2; // skip sender change notes
                note.mt_arr_idx = Math.floor(note.mt_leaf_idx/MT_NUM_LEAVES(gs.mt_depth)) * MT_ARR_FULL_TREE_OFFSET(gs.mt_depth) +
                                  note.mt_leaf_idx % MT_NUM_LEAVES(gs.mt_depth) + MT_ARR_LEAF_ROW_OFFSET(gs.mt_depth);
                newNotes.push(note);
              }
            }
          }
          else
          {
            if(dec_tx.receiver)
            {
              // receiver notes
              for(let i = 0; i < dec_tx.receiver.notes.length; i++)
              {
                let note = dec_tx.receiver.notes[i];
                // get nullifier and commitment
                note.commitment = await zeos_note_commitment(JSON.stringify(note), newKp.addr.h_sk);
                note.nullifier = await zeos_note_nullifier(JSON.stringify(note), newKp.sk);
                note.mt_leaf_idx = tx.mt_leaf_count + i*2; // skip change notes
                note.mt_arr_idx = Math.floor(note.mt_leaf_idx/MT_NUM_LEAVES(gs.mt_depth)) * MT_ARR_FULL_TREE_OFFSET(gs.mt_depth) +
                                  note.mt_leaf_idx % MT_NUM_LEAVES(gs.mt_depth) + MT_ARR_LEAF_ROW_OFFSET(gs.mt_depth);
                newNotes.push(note);
              }
            }
          }
          break;

          // BURN
          case 3:
            if(dec_tx.sender)
            {
              // for each note in unspent notes check if it was spent
              for(let i = newKp.unspentNotes.length-1; i >= 0; i--)
              {
                // two notes are equal if rho is equal
                if(dec_tx.sender.notes[0].rho.every(function(v, x) {return v === newKp.unspentNotes[i].rho[x]}))
                {
                  newKp.spentNotes.push(...newKp.unspentNotes.splice(i, 1));
                }
              }

              // add change note [TODO: in case of multiple notes bein sent: the biggest change note (i.e. the only one that is not zero) must come first!]
              let note = dec_tx.sender.change;
              note.commitment = await zeos_note_commitment(JSON.stringify(note), newKp.addr.h_sk);
              note.nullifier = await zeos_note_nullifier(JSON.stringify(note), newKp.sk);
              note.mt_leaf_idx = tx.mt_leaf_count;
              note.mt_arr_idx = Math.floor(note.mt_leaf_idx/MT_NUM_LEAVES(gs.mt_depth)) * MT_ARR_FULL_TREE_OFFSET(gs.mt_depth) +
                                note.mt_leaf_idx % MT_NUM_LEAVES(gs.mt_depth) + MT_ARR_LEAF_ROW_OFFSET(gs.mt_depth);
              newNotes.push(note);
            }
            break;
      }

      // sort new notes into unspent notes array of this key pair
      for(const n of newNotes)
      {
        if(newKp.unspentNotes.length == 0 ||
          n.quantity.amount > newKp.unspentNotes[newKp.unspentNotes.length-1].quantity.amount)
        {
          newKp.unspentNotes.push(n);
        }
        else
        {
          let i = 0;
          for(const m of newKp.unspentNotes)
          {
            if(n.quantity.amount <= m.quantity.amount)
            {
              newKp.unspentNotes.splice(i, 0, n);
              break;
            }
            i++;
          }
        }
      }

      // add tx to list
      if(dec_tx.sender || dec_tx.receiver)
      {
        newKp.transactions.push(dec_tx);
      }
    }

    // save kp state in array of new KeyPairs
    let newKeyPairs = [...keyPairs.filter((e)=>{return e.id !== newKp.id}), newKp]

    _log('Syncing with EOS blockchain... done!')

    setKeyPairs(newKeyPairs);
    console.log(newKeyPairs);
  }

  function onReadWalletFromFile()
  {
    let e = document.getElementById('wallet-file')
    if(e.files.length === 0)
    {
      alert('No wallet file selected')
      return
    }

    let reader = new FileReader();
    reader.readAsText(e.files[0]);
    reader.onload = function() {
      let wallet = JSON.parse(reader.result);
      setKeyPairs(wallet.keyPairs);
      setSelectedKey(wallet.selectedKey);
    };
  }

  function onWriteWalletToFile()
  {
    let file = new File([JSON.stringify({keyPairs: keyPairs, selectedKey: selectedKey})], "wallet.zeos", {
      type: "text/plain;charset=utf-8",
    });
    saveAs(file, "wallet.zeos");
  }

  async function onUserChange(user)
  {
    setActiveUser(user);
    if(user)
    {
      let username = await user.getAccountName();
      setUsername(username);
      setZeosBalance(await getZeosAccountBalance(username));
    }
    else
    {
      setUsername("");
      setZeosBalance(0);
    }
  }

  async function onZUserChange(user)
  {
    setActiveZUser(user);
    if(user)
    {
      let username = await user.getAccountName();
      setZUsername(username);
      setZZeosBalance(await getZeosAccountBalance(username));
    }
    else
    {
      setZUsername("");
      setZZeosBalance(0);
    }
  }

  async function onFaucet(usern)
  {
    try
    {
      EOSTransaction.actions[0].name = 'issue';
      EOSTransaction.actions[0].data = {to: usern, quantity: '100.0000 ZEOS', memo: 'ZEOS Faucet - Thanks for testing the protocol! #PrivacyMatters'};
      EOSTransaction.actions[0].authorization[0].actor = usern;
      console.log(EOSTransaction);
      _log("Push Issue Transaction...");
      let res = await activeUser.signTransaction(EOSTransaction, { broadcast: true });
      _log("Push Issue Transaction... " + res.status + "! Transaction ID: " + res.transactionId);
    }
    catch(error)
    {
      _log("Push Issue Transaction... " + error);
    }
  }

  UALLogin.displayName = 'UALLogin'
  const UALLoginUAL = withUAL(UALLogin)
  UALLogin.displayName = 'UALLoginUAL'

  const appName = 'My App'
  const lynx = new Lynx([kylinTestnet])
  const ledger = new Ledger([kylinTestnet])
  const anchor = new Anchor([kylinTestnet], { appName })

  return (
    <ThemeProvider theme={theme}>
    <Header keyPairs={keyPairs} selectedKey={selectedKey} onSync={onSync} onLoadWallet={onReadWalletFromFile} onSaveWallet={onWriteWalletToFile} />
    <div className='content'>
        <KeyManagement keyPairs={keyPairs} selectedKey={selectedKey} onCreateNewKey={onCreateNewKey} onKeySelect={onKeySelect} onDeleteKey={onDeleteKey} onImportKey={onImportKey} zeosBalance={getZeosWalletBalance()} cpy2cb={cpy2cb} />
      <div className='row'>
        <div className='column component'>
          <div className='header'><InputLabel>TRANSPARENT EOS WORLD</InputLabel></div>
          <UALProvider chains={[kylinTestnet]} authenticators={[ledger, lynx, anchor]} appName={'My App'}>
            <UALLoginUAL appActiveUser={activeUser} username={username} zeosBalance={zeosBalance} onChange={onUserChange} onFaucet={onFaucet} />
          </UALProvider>
          <div className='row'>
            <TransactionInterface id='mint' isToZeosAddr={true} startIcon={<AddIcon />} onExecute={onMint}/>
            <TransactionInterface id='burn' isToZeosAddr={false} startIcon={<RemoveIcon />} onExecute={onBurn}/>
          </div>
        </div>
        <div className='column component'>
          <div className='header'><InputLabel>PRIVATE ZEOS WORLD</InputLabel></div>
          <UALProvider chains={[kylinTestnet]} authenticators={[ledger, lynx, anchor]} appName={'My App'}>
            <UALLoginUAL appActiveUser={activeZUser} username={zUsername} zeosBalance={zZeosBalance} onChange={onZUserChange} onFaucet={onFaucet} />
          </UALProvider>
          <div className='row'>
            <TransactionInterface id='ztransfer' isToZeosAddr={true} startIcon={<ArrowForwardIosIcon />} onExecute={onZTransfer}/>
          </div>
        </div>
      </div>
      <TransactionHistory keyPairs={keyPairs} selectedKey={selectedKey} cpy2cb={cpy2cb} />
    </div>
    <Logger logs={logs} />
    </ThemeProvider>
  )
}

export default App;
