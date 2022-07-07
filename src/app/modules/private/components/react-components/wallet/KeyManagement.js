import * as React from 'react'
import { useState, useEffect } from 'react'
import { binary_to_base58 } from 'base58-js'

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { IconButton, Tooltip } from '@material-ui/core';

function KeyManagement({keyPairs, selectedKey, onCreateNewKey, onKeySelect, onDeleteKey, onImportKey, zeosBalance, cpy2cb})
{
  const [viewSK, setViewSK] = useState(false);

  function copyAddrToClipboard()
  {
      if(-1 === selectedKey)
      {
        alert('Error: No address selected');
        return;
      }
      var addr = 'Z' + binary_to_base58(keyPairs[selectedKey].addr.h_sk.concat(keyPairs[selectedKey].addr.pk));
      cpy2cb(addr);
  }

  function copySkToClipboard()
  {
      if(-1 === selectedKey)
      {
        alert('Error: No Key selected');
        return;
      }
      var addr = 'S' + binary_to_base58(keyPairs[selectedKey].sk);
      cpy2cb(addr);
  }

  return (
    <div className='component' id='key-management'>
      <div className='header'><InputLabel>Key Management</InputLabel></div>
      <div className='column'>
        <div className='text-row'>
          <InputLabel htmlFor='key-input'>Secret Key:</InputLabel>
          <Input id='key-input' />
          <Button variant='contained' startIcon={<SaveAltIcon />} onClick={()=>onImportKey()}>Import</Button>
          <Button variant='contained' startIcon={<AddIcon />} onClick={()=>onCreateNewKey()}>New Random Key</Button>
        </div>
        <div className='text-row'>
          <InputLabel htmlFor='key-select'>Addresses:</InputLabel>
          <Select id='key-select' value={selectedKey >= keyPairs.length ? -1 : selectedKey} onChange={(e)=>onKeySelect(e)}>
            {(-1 === selectedKey || selectedKey >= keyPairs.length) ?
            <MenuItem value={-1}><em>None</em></MenuItem> :
            keyPairs.slice(0).reverse().map((kp)=>{return(<MenuItem key={kp.id} value={kp.id}>Z{binary_to_base58(kp.addr.h_sk.concat(kp.addr.pk))}</MenuItem>)})}
          </Select>
          {(-1 === selectedKey || selectedKey >= keyPairs.length) ? <></> : <div>
            <Tooltip title='copy address to clipboard'>
              <IconButton onClick={()=>copyAddrToClipboard()}>
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='view secret key of this address'>
              <IconButton onClick={()=>setViewSK(true)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='delete secret key and corresponding address'>
              <IconButton onClick={()=>onDeleteKey()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>}
        </div>
        <div>
          <Dialog open={viewSK} onClose={()=>setViewSK(false)}>
            <DialogTitle>Secret Key</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {(-1 === selectedKey || selectedKey >= keyPairs.length) ? 'No Key selected' : 'S' + binary_to_base58(keyPairs[selectedKey].sk)}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant='contained' onClick={()=>setViewSK(false)}>Close</Button>
              {(-1 === selectedKey || selectedKey >= keyPairs.length) ? <></> : 
              <Tooltip title='copy secret key to clipboard'>
                <IconButton onClick={()=>{copySkToClipboard();setViewSK(false);}}>
                  <FileCopyIcon autoFocus />
                </IconButton>
              </Tooltip>}
            </DialogActions>
          </Dialog>
        </div>
        <div className='text-row'>
          <InputLabel>Balance: {zeosBalance/10**4} ZEOS</InputLabel>
        </div>
      </div>
    </div>
  )
}

export default KeyManagement