import * as React from 'react';
import { useState, useEffect } from 'react'
import { binary_to_base58 } from 'base58-js'

import InputLabel from '@material-ui/core/InputLabel';
//import MoneyIcon from '@material-ui/icons/Money';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
//import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { IconButton, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function asset2Str(quantity)
{
    let decimals = quantity.symbol & 0xFF;
    let sym_str = "";
    for(let v = quantity.symbol/2**8; v > 1; v /= 2**8)
    {
        sym_str += String.fromCharCode(v & 0xFF);
    }
    return quantity.amount/10**decimals + ' ' + sym_str;
}

const stringify = require("json-stringify-pretty-compact");
// from: https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
function syntaxHighlight(json) {
    if (typeof json != 'string') {
         //json = JSON.stringify(json, undefined, 2);
         json = stringify(json, {maxLength: 250})
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function bytes2U64(bytes)
{
    var value = 0;
    for(var i = 0; i < bytes.length; i++)
    {
        value += bytes[i]*2**(i*8);
    }
    return value;
  }

function truncate(str, n)
{
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
}

export default function TransactionHistory({keyPairs, selectedKey, cpy2cb})
{

    function NoteDialog({note, view, onClose})
    {
        return (
          <Dialog open={view} onClose={()=>onClose()}>
            <DialogTitle>Note '{asset2Str(note.quantity)}'</DialogTitle>
            <DialogContent>
              <pre><div dangerouslySetInnerHTML={{ __html: syntaxHighlight(note) }} /></pre>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>onClose()} variant='contained' >Close</Button>
            </DialogActions>
          </Dialog>
        )
    }

    function Note({n})
    {
        const [view, setView] = useState(false);
        function onClose()
        {
          setView(false);
        };

        // TODO: remove warning by adding key to list elements
        // key={parseInt(n.commitment.substr(0, 8), 16)}
        return (
          <InputLabel>
            <div className='note'>
              <Tooltip title='view details'>
                <IconButton onClick={()=>setView(true)}>
                    <LocalAtmIcon />
                </IconButton>
              </Tooltip>
              <div className='note-quantity'>{asset2Str(n.quantity)}</div>
              <NoteDialog note={n} view={view} onClose={onClose} />
            </div>
          </InputLabel>
        );
    }

    function TXDialog({tx, view, onClose})
    {
        return (
          <Dialog open={view} onClose={()=>onClose()}>
            <DialogTitle>Transaction {tx.id}</DialogTitle>
            <DialogContent>
              <pre><div dangerouslySetInnerHTML={{ __html: syntaxHighlight(tx) }} /></pre>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>onClose()} variant='contained' >Close</Button>
            </DialogActions>
          </Dialog>
        )
    }

    function MintTransaction({tx})
    {
        const [view, setView] = useState(false);
        function onClose()
        {
          setView(false);
        };

        let username = String.fromCharCode(...tx.epk_s.slice(0, 16).filter((b)=>{return b !== 0}));
        let amt = bytes2U64(tx.epk_s.slice(16, 24));
        let sym = bytes2U64(tx.epk_s.slice(24, 32));
        let qty = {amount: amt, symbol: sym};
        let memo = String.fromCharCode(...tx.receiver.memo.filter((b)=>{return b !== 0}));

        // TODO: remove warning by adding key to list elements
        // key={tx.id}
        return (
              <TableRow>
                <TableCell>{tx.id}</TableCell>
                <TableCell><Button variant='contained' style={{width: '100%'}} startIcon={<AddIcon />} onClick={()=>setView(true)}>Mint</Button></TableCell>
                <TableCell></TableCell>
                <TableCell>{asset2Str(qty)}</TableCell>
                <TableCell>{username}</TableCell>
                <TableCell>{memo}</TableCell>
                <TableCell><TXDialog tx={tx} view={view} onClose={onClose} /></TableCell>
              </TableRow>
        )
    }

    function ZTransferTransaction({tx, pk})
    {
        const [view, setView] = useState(false);
        const [viewVK, setViewVK] = useState(false);

        let addr = tx.sender ? "Z" + binary_to_base58(tx.sender.addr_r.h_sk.concat(tx.sender.addr_r.pk)) : "<received>";
        let amt = 0;
        for(const n of tx.receiver.notes)
        {
            amt += n.quantity.amount;
        }
        let qty = {amount: amt, symbol: tx.receiver.notes[0].quantity.symbol};
        let memo = String.fromCharCode(...tx.receiver.memo.filter((b)=>{return b !== 0}));

        // TODO: remove warning by adding key to list elements
        // key={tx.id}
        return (
              <TableRow>
                <TableCell>{tx.id}</TableCell>
                <TableCell><Button variant='contained' style={{width: '100%'}} startIcon={tx.sender ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />} onClick={()=>setView(true)}>ZTransfer</Button></TableCell>
                <TableCell>
                  {tx.sender ?
                  <Tooltip title='view Viewing key for this transaction'>
                    <IconButton onClick={()=>setViewVK(true)}>
                        <VisibilityIcon />
                    </IconButton>
                  </Tooltip> : <></>}  
                </TableCell>
                <TableCell>{asset2Str(qty)}</TableCell>
                <TableCell>
                    {truncate(addr, 20)}
                    {tx.sender ?
                    <Tooltip title='copy addr to clipboard'>
                        <IconButton onClick={()=>cpy2cb(addr)}>
                            <FileCopyIcon autoFocus />
                        </IconButton>
                    </Tooltip> : <></>}
                </TableCell>
                <TableCell>{memo}</TableCell>
                <TableCell>
                  <TXDialog tx={tx} view={view} onClose={()=>setView(false)} />
                  {tx.sender ? 
                  <Dialog open={viewVK} onClose={()=>setViewVK(false)}>
                      <DialogTitle>Secret Viewing Key</DialogTitle>
                      <DialogContent>
                      <DialogContentText>
                      {'V' + binary_to_base58(tx.sender.esk_s.concat(pk))}
                      </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant='contained' onClick={()=>setViewVK(false)}>Close</Button>
                        <Tooltip title='copy viewing key to clipboard'>
                          <IconButton onClick={()=>{cpy2cb('V'+binary_to_base58(tx.sender.esk_s.concat(pk)));setViewVK(false);}}>
                            <FileCopyIcon autoFocus />
                          </IconButton>
                        </Tooltip>
                      </DialogActions>
                  </Dialog> : <></>}
                </TableCell>
              </TableRow>
        )
    }

    function BurnTransaction({tx})
    {
        const [view, setView] = useState(false);
        function onClose()
        {
          setView(false);
        };

        let username = String.fromCharCode(...tx.epk_r.slice(0, 16).filter((b)=>{return b !== 0}));
        let amt = bytes2U64(tx.epk_r.slice(16, 24));
        let sym = bytes2U64(tx.epk_r.slice(24, 32));
        let qty = {amount: amt, symbol: sym};

        // TODO: remove warning by adding key to list elements
        // key={tx.id}
        return (
              <TableRow>
                <TableCell>{tx.id}</TableCell>
                <TableCell><Button variant='contained' style={{width: '100%'}} startIcon={<RemoveIcon />} onClick={()=>setView(true)}>Burn</Button></TableCell>
                <TableCell></TableCell>
                <TableCell>{asset2Str(qty)}</TableCell>
                <TableCell>{username}</TableCell>
                <TableCell><TXDialog tx={tx} view={view} onClose={onClose} /></TableCell>
              </TableRow>
        )
    }

    // TODO only output Unspent Notes and Spent Notes if they contain elements so far only keyPairs[selectedKey].transactions.length is checked for all
    return (
        <div>
            {(-1 === selectedKey || selectedKey >= keyPairs.length || 0 === keyPairs[selectedKey].transactions.length) ? <></> :
            <div className='column'>
                <div className='row'>
                <div className='component note-row'>
                    <div className='header'><InputLabel>Unspent Notes</InputLabel></div>
                    {keyPairs[selectedKey].unspentNotes.map((n)=>{return n.quantity.amount > 0 ? (<Note n={n} />) : (<></>)})}
                </div>
                {0 === keyPairs[selectedKey].spentNotes.length ? <></> :
                <div className='component note-row'>
                    <div className='header'><InputLabel>Spent Notes</InputLabel></div>
                    {keyPairs[selectedKey].spentNotes.map((n)=>{return n.quantity.amount > 0 ? (<Note n={n} />) : (<></>)})}
                </div>}
                </div>
                <div className='row'>
                <div className='component column'>
                    <div className='header'><InputLabel>Transactions</InputLabel></div>
                    <Table>
                    <TableHead><TableRow><TableCell>ID</TableCell><TableCell>TYPE</TableCell><TableCell>VIEW KEY</TableCell><TableCell>ASSET</TableCell><TableCell>TO/FROM</TableCell><TableCell>MEMO</TableCell></TableRow></TableHead>
                    <TableBody>
                    {keyPairs[selectedKey].transactions.slice(0).reverse().map((tx)=>{
                        return 1 === tx.type ? (<MintTransaction tx={tx} />) :
                               2 === tx.type ? (<ZTransferTransaction tx={tx} pk={keyPairs[selectedKey].addr.pk} />) :
                               3 === tx.type ? (<BurnTransaction tx={tx} />) : <></>})}
                    </TableBody>
                    </Table>
                </div>
                </div>
            </div>
            }
        </div>
    )
}