import { AfterViewInit, Component, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../wallet/App';

@Component({
  selector: 'app-wallet-wrapper',
  templateUrl: './wallet-wrapper.component.html',
  styleUrls: ['./wallet-wrapper.component.scss']
})
export class WalletWrapperComponent implements OnChanges, AfterViewInit, OnDestroy {

  public title = 'walletreactapp'
  public rootId = 'rootId';

  constructor(
    private elementRef: ElementRef
  ) {

  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = `
      import init, {
          create_mint_transaction,
          create_ztransfer_transaction,
          create_burn_transaction,
          decrypt_transaction,
          create_key,
          note_commitment,
          note_nullifier
      } from "./src/pkg/sapling.js";

      window.zeos_create_mint_transaction = async function(params_bytes, addr_json, tx_r_json, eos_username)
      {
          var res;
          await init().then(() => {
              res = create_mint_transaction(params_bytes, addr_json, tx_r_json, eos_username)
          });
          return res;
      }
      window.zeos_create_ztransfer_transaction = async function(params_bytes, secret_key, tx_s_json, tx_r_json, auth_path_v_json, auth_path_b_json)
      {
          var res;
          await init().then(() => {
              res = create_ztransfer_transaction(params_bytes, secret_key, tx_s_json, tx_r_json, auth_path_v_json, auth_path_b_json)
          });
          return res;
      }
      window.zeos_create_burn_transaction = async function(params_bytes, secret_key, tx_s_json, quantity_json, auth_path_v_json, auth_path_b_json, eos_username)
      {
          var res;
          await init().then(() => {
              res = create_burn_transaction(params_bytes, secret_key, tx_s_json, quantity_json, auth_path_v_json, auth_path_b_json, eos_username)
          });
          return res;
      }
      window.zeos_decrypt_transaction = async function(sk, enc_tx_json)
      {
          var res;
          await init().then(() => {
              res = decrypt_transaction(sk, enc_tx_json)
          });
          return res;
      }
      window.zeos_create_key = async function(seed)
      {
          var res;
          await init().then(() => {
              res = create_key(seed)
          });
          return res;
      }
      window.zeos_note_commitment = async function(note_json, h_sk)
      {
          var res;
          await init().then(() => {
              res = note_commitment(note_json, h_sk)
          });
          return res;
      }
      window.zeos_note_nullifier = async function(note_json, sk)
      {
          var res;
          await init().then(() => {
              res = note_nullifier(note_json, sk)
          });
          return res;
      }
    `;
    this.elementRef.nativeElement.appendChild(s);

    ReactDOM.render(
      React.createElement(App),
      document.getElementById(this.rootId)
    )
  }
}

