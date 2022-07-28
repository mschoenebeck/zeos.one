import * as React from 'react'
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

function UALLogin({ ual: { activeUser, activeAuthenticator, logout, showModal }, appActiveUser, username, zeosBalance, onChange, onFaucet })
{
    if(activeUser && !appActiveUser)
    {
        onChange(activeUser);
    }
    else if(!activeUser && appActiveUser)
    {
        onChange(null);
    }

    // TODO: id is used twice because there are two UALLogins
    return (
      <div className='component full-width' id='ual-login'>
        <div className='column'>
          <div className='text-row' style={{alignItems: 'center'}}>
            {
              !!activeUser && !!activeAuthenticator ? 
              <Button variant='contained' color='secondary' onClick={logout}>Logout</Button> : 
              <Button variant='contained' color='primary' onClick={showModal}>UAL Modal</Button>
            }
            {
              activeUser ? <Button startIcon={<AttachMoneyIcon />} variant='contained' color='primary' onClick={()=>onFaucet(username)}>ZEOS Faucet</Button> : <></>
            }
            <div className='column'>
            <InputLabel>EOS Account: {appActiveUser ? username : '<disconnected>'}</InputLabel>
            <InputLabel>Balance: {appActiveUser ? zeosBalance : '0'}</InputLabel>
            </div>
          </div>
        </div>
      </div>
    );
}

export default UALLogin