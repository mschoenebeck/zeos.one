import * as React from 'react'
import { useState, useEffect } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

export default function Logger({logs})
{
    useEffect(() => {
        // logger auto scrolling
        var e = document.getElementById('logger');
        if(e)
        {
            e.scrollTop = e.scrollHeight;
        }
    });

    return (
        <div className='logger-wrapper'>
        <div className='header'><InputLabel>Session Log</InputLabel></div>
        <div id='logger'>
            <div className='column'>
                {logs.map((l)=>{return(<InputLabel><ArrowForwardIosIcon style={{ fontSize: 18 }} />{l}</InputLabel>)})}
            </div>
        </div>
        </div>
    )
}