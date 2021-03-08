import React, { useState, useEffect } from "react"
//api
import app from "../firebase";
import {useData} from '../api/auth-provider'
import {auth} from "../firebase";
import {getRate,getClientData,deleteClient,queryClientData} from '../api/data'
import { RiListSettingsFill,RiInboxUnarchiveLine } from "react-icons/ri";
// import { GrPauseFill, GrPlayFill,GrShare} from 'react-icons/gr';
// import { RiArchiveLine } from "react-icons/ri";



const ArchivedJob = (aJobProps) => {

    const db = app.firestore();

    const handleRestoreJob =()=> {
   
    let client = aJobProps.client

    getClientData(client).then((doc) => {
        if (doc.exists) {
        db.settings({
            timestampsInSnapshots: true
        });

        let selectedJob = aJobProps.jobId
        let existingArchive = doc.data().archivedJobs
        let existingJobs = doc.data().jobs
        let archivedJobs = existingArchive.filter(job => job.jobId !== selectedJob);
        let mergeJob = existingArchive.filter(job => job.jobId === selectedJob);
        let jobs = [...existingJobs,...mergeJob]
    
        // filter selected job from array

        setTimeout(()=>{
            // let jobs = existingJobs.filter(job => job.jobId !== selectedJob);
            queryClientData(client).update({
            jobs
            }).then(
                queryClientData(client).update({
                    archivedJobs
            })
            ) 
        },100)
        
        }
        else {
        console.log('no such document')
        }         
    })
} 

    return (               
            <li >  
                {
                aJobProps.job.job
                }
                {
                    new Date(aJobProps.jobId) .toString() .slice() .replace(/\GMT(.*)/g, "")
                }
                <span  className="existingjobs__newtask theme--button theme-bsml" value={'togglearchive'} onClick={handleRestoreJob}><RiInboxUnarchiveLine/></span>
            </li>
        );
}

export default ArchivedJob;


